import { Middleware, Dispatch } from "redux"
import {
  changeFormField,
  setFormFieldAsyncValidity,
  initializeForm,
} from "./actions"
import { validateAsyncRules } from "./field"
import { AnyFormSchema } from "./form"
import { keys } from "ts-object"

type Cancelation = () => void
type FieldValidationDict = { [fieldKey: string]: Cancelation }

const fieldValidationKey = (field: string, form: string) => `${form}-${field}`

export const asyncValidationMiddleware: (
  asyncValidationDebounceTime: number,
) => Middleware = (asyncValidationDebounceTime = 200) => {
  const runningFieldValidation: FieldValidationDict = {}

  return ({ dispatch }) => (next) => (action) => {
    const result = next(action)

    if (changeFormField.match(action)) {
      const { payload: { field, value, formSchema } } = action
      runFieldAsyncValidation(
        value,
        formSchema,
        field,
        asyncValidationDebounceTime,
        dispatch,
        runningFieldValidation,
      )
    }

    if (initializeForm.match(action)) {
      const { formSchema } = action.payload

      for (const fieldName in formSchema.fields) {
        const field = formSchema.fields[fieldName]
        runFieldAsyncValidation(
          field.initialValue,
          formSchema,
          fieldName,
          asyncValidationDebounceTime,
          dispatch,
          runningFieldValidation,
        )
      }
    }

    return result
  }
}

const runFieldAsyncValidation = (
  value: any,
  formSchema: AnyFormSchema,
  field: string,
  asyncValidationDebounceTime: number,
  dispatch: Dispatch<any>,
  runningFieldValidation: FieldValidationDict,
): void => {
  const asyncRules = formSchema.fields[field].rules.async

  if (!asyncRules || keys(asyncRules).length === 0) return

  const key = fieldValidationKey(field, formSchema.name)
  const cancelFieldValidation = runningFieldValidation[key]

  cancelFieldValidation && cancelFieldValidation()

  let canceled = false

  const timeoutToken = setTimeout(() => {
    validateAsyncRules(value, asyncRules).then((result) => {
      if (canceled) return

      delete runningFieldValidation[key]
      dispatch(
        setFormFieldAsyncValidity.done({
          params: { field, formSchema },
          result: { result },
        }),
      )
    })
  }, asyncValidationDebounceTime)

  runningFieldValidation[key] = () => {
    canceled = true
    clearTimeout(timeoutToken)
    delete runningFieldValidation[key]
  }
}
