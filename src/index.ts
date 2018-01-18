import { FormInfo, FormState } from "./form"
import { pipe } from "ts-function"
import * as Forms from "./forms"
import * as Form from "./form"

import * as rawFormActions from "./actions"
import { map } from "ts-object";

export { asyncValidationMiddleware } from "./async-validation-middleware"

export { FormSchema, FormState, FormInfo } from "./form"

export const getFormState = <Model>(
  formName: string,
  store: Forms.FormsState,
): FormState<Model> => Forms.getForm<Model>(formName)(store)

export const getFormInfo = <Model>(
  formName: string,
  store: Forms.FormsState,
): FormInfo<Model> =>
  pipe(store, Forms.getForm<Model>(formName), Form.getFormInfo)

export const formsReducer = Forms.formsReducer

export const actions = rawFormActions

export const createFormActions = <TModel>(formSchema: Form.FormSchema<TModel>) => ({
  initializeForm: () => actions.initializeForm({ formSchema }),
  fields: map((field, fieldName) => ({
    changeFormField: (value: typeof field.initialValue) =>
      actions.changeFormField({ field: fieldName, value, formSchema }),
    focusField: () => actions.focusField({ field: fieldName, formSchema }),
    blurField: () => actions.blurField({ field: fieldName, formSchema }),
  }) , formSchema.fields)
})
