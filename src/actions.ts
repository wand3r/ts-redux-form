import { AnyFormSchema, FormSchema } from "./form"
import { actionCreatorFactory, AnyAction } from "typescript-fsa"
import { some, map, values } from "ts-object"
import { bindActionCreators, Dispatch } from "redux"

const actionCreator = actionCreatorFactory("FORM")

export const actions = {
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

export const createFormActions = <TModel>(
  formSchema: FormSchema<TModel>,
): BindedActionCreators<TModel> => ({
  fields: map(
    (field, fieldName) => ({
      change: (value: typeof field.initialValue) =>
        actions.changeFormField({ field: fieldName, value, formSchema }),
      focus: () => actions.focusField({ field: fieldName, formSchema }),
      blur: () => actions.blurField({ field: fieldName, formSchema }),
    }),
    formSchema.fields,
  ),
})

export const createFormActionsWithDispatch = <TModel>(
  formSchema: FormSchema<TModel>,
) => (dispatch: Dispatch<any>): BindedActionCreators<TModel> => {
  const actions = createFormActions(formSchema)
  return {
    fields: map(
      (action) => bindActionCreators(action, dispatch),
      actions.fields,
    ),
  }
}

export type BindedActionCreators<TModel> = {
  fields: {
    [P in keyof TModel]: {
      change: (value: TModel[P]) => void
      focus: () => void
      blur: () => void
    }
  }
}
