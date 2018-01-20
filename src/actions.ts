import { AnyFormSchema, FormSchema } from "./form"
import { actionCreatorFactory, AnyAction } from "typescript-fsa"
import { some, map, values } from "ts-object"

const actionCreator = actionCreatorFactory("FORM")

export const actions = {
  initializeForm: actionCreator<{
    formSchema: AnyFormSchema
  }>("INITIALIZE"),

  changeFormField: actionCreator<{
    value: any
    field: string
    formSchema: AnyFormSchema
  }>("CHANGE_FIELD"),

  focusField: actionCreator<{
    field: string
    formSchema: AnyFormSchema
  }>("FOCUS_FIELD"),

  blurField: actionCreator<{
    field: string
    formSchema: AnyFormSchema
  }>("BLUR_FIELD"),

  setFormFieldAsyncValidity: actionCreator<{
    field: string
    formSchema: AnyFormSchema
    result: { [rule: string]: boolean }
  }>("SET_FIELD_ASYNC_VALIDITY"),
}

const expressionType = <T>(x: (...args: any[]) => T) => {
  return {} as T
}

const _actions = values(actions).map(expressionType)

export type FormAction = typeof _actions[number]

export const isFormAction = (action: AnyAction): action is FormAction =>
  some((formAction) => formAction.type === action.type, actions)

export const createFormActions = <TModel>(formSchema: FormSchema<TModel>) => ({
  initializeForm: () => actions.initializeForm({ formSchema }),
  fields: map(
    (field, fieldName) => ({
      changeFormField: (value: typeof field.initialValue) =>
        actions.changeFormField({ field: fieldName, value, formSchema }),
      focusField: () => actions.focusField({ field: fieldName, formSchema }),
      blurField: () => actions.blurField({ field: fieldName, formSchema }),
    }),
    formSchema.fields,
  ),
})
