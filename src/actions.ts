import { AnyFormSchema, FormSchema } from "./form"
import { actionCreatorFactory } from "typescript-fsa"
import { some, map } from "ts-object"

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

  setFormFieldAsyncValidity: actionCreator.async<
    { field: string; formSchema: AnyFormSchema },
    { result: { [rule: string]: boolean } },
    any
  >("SET_FIELD_ASYNC_VALIDITY"),
}

export const isFormAction = (action: { type: string }): boolean =>
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
