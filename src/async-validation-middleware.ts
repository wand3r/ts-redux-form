import { Middleware, Dispatch } from "redux"
import { actions } from "./actions"
import { validateAsyncRules } from "./field"
import { AnyFormSchema } from "./form"
import { keys } from "ts-object"

type Cancelation = () => void
type FieldValidationDict = {
  [formId: string]: {
    [fieldKey: string]: Cancelation
  }
}

const { changeFormField, setFormFieldAsyncValidity } = actions

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
  const formId = formSchema._id

  if (!asyncRules || keys(asyncRules).length === 0) return

  if (runningFieldValidation[formId] === undefined) {
    runningFieldValidation[formId] = {}
  }

  const cancelFieldValidation = runningFieldValidation[formId][field]

  cancelFieldValidation && cancelFieldValidation()

  let canceled = false

  const timeoutToken = setTimeout(() => {
    validateAsyncRules(value, asyncRules).then((result) => {
      if (canceled) return

      delete runningFieldValidation[formId][field]
      dispatch(
        setFormFieldAsyncValidity({
          field,
          formSchema,
          result,
        }),
      )
    })
  }, asyncValidationDebounceTime)

  runningFieldValidation[formId][field] = () => {
    canceled = true
    clearTimeout(timeoutToken)
    delete runningFieldValidation[formId][field]
  }
}
