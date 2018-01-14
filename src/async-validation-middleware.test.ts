import { FormSchema } from "./form"
import { asyncValidationMiddleware } from "./async-validation-middleware"
import {
  focusField,
  changeFormField,
  setFormFieldAsyncValidity,
} from "./actions"

describe("async-validation-middleware", () => {
  const personForm: FormSchema<{ age: number }> = {
    name: "personForm",
    rules: {},
    fields: {
      age: {
        initialValue: 18,
        rules: {
          sync: {},
          async: {
            moreThen12: (x) => Promise.resolve(x > 12),
            lessThen100: (x) => Promise.resolve(x < 100),
          },
        },
      },
    },
  }

  it("do nothing on other actions", () => {
    const middleware = asyncValidationMiddleware(200)
    const dispatch = jest.fn()
    const getState = jest.fn()
    const next = jest.fn()
    const action = focusField({ field: "age", formSchema: personForm })
    middleware({ dispatch, getState })(next)(action)
    expect(next.mock.calls.length).toBe(1)
    expect(next.mock.calls[0][0]).toEqual(action)
    expect(dispatch.mock.calls.length).toBe(0)
  })

  it("dispatch one setFormFieldAsyncValidity action after one changeFormField action", (done) => {
    const dispatch = jest.fn((action) => {
      expect(action).toEqual(
        setFormFieldAsyncValidity.done({
          params: { formSchema: personForm, field: "age" },
          result: { result: { moreThen12: false, lessThen100: true } },
        }),
      )
      done()
    })
    const getState = jest.fn()
    const next = jest.fn()
    const middleware = asyncValidationMiddleware(200)({ dispatch, getState })(
      next,
    )
    const action = changeFormField({
      field: "age",
      value: 11,
      formSchema: personForm,
    })
    middleware(action)
    expect(next.mock.calls.length).toBe(1)
    expect(next.mock.calls[0][0]).toEqual(action)
  })

  it("dispatch one setFormFieldAsyncValidity action after many changeFormField action in short time", (done) => {
    const dispatch = jest.fn((action) => {
      expect(action).toEqual(
        setFormFieldAsyncValidity.done({
          params: { formSchema: personForm, field: "age" },
          result: { result: { moreThen12: true, lessThen100: false } },
        }),
      )
      done()
    })
    const getState = jest.fn()
    const next = jest.fn()
    const middleware = asyncValidationMiddleware(200)({ dispatch, getState })(
      next,
    )
    const action = changeFormField({
      field: "age",
      value: 10,
      formSchema: personForm,
    })
    const action2 = changeFormField({
      field: "age",
      value: 50,
      formSchema: personForm,
    })
    const action3 = changeFormField({
      field: "age",
      value: 101,
      formSchema: personForm,
    })
    middleware(action)
    middleware(action2)
    middleware(action3)
    expect(next.mock.calls.length).toBe(3)
  })

  it("dispatch two setFormFieldAsyncValidity action after many changeFormField action in longer time", (done) => {
    const dispatch = jest
      .fn()
      .mockImplementationOnce((action) => {
        expect(action).toEqual(
          setFormFieldAsyncValidity.done({
            params: { formSchema: personForm, field: "age" },
            result: { result: { moreThen12: true, lessThen100: true } },
          }),
        )
      })
      .mockImplementationOnce((action) => {
        expect(action).toEqual(
          setFormFieldAsyncValidity.done({
            params: { formSchema: personForm, field: "age" },
            result: { result: { moreThen12: true, lessThen100: false } },
          }),
        )
        done()
      })
    const getState = jest.fn()
    const next = jest.fn()
    const debounce = 200
    const middleware = asyncValidationMiddleware(debounce)({
      dispatch,
      getState,
    })(next)
    const action = changeFormField({
      field: "age",
      value: 10,
      formSchema: personForm,
    })
    const action2 = changeFormField({
      field: "age",
      value: 50,
      formSchema: personForm,
    })
    const action3 = changeFormField({
      field: "age",
      value: 101,
      formSchema: personForm,
    })
    middleware(action)
    middleware(action2)
    setTimeout(() => middleware(action3), debounce + 50)
  })
})
