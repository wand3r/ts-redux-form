import { FormInfo, FormState } from "./form"
import { pipe } from "ts-function"
import * as Forms from "./forms"
import * as Form from "./form"

import * as formActions from "./actions"

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

export const actions = formActions

export const createFormActions = (formSchema: Form.AnyFormSchema) => ({
  initializeForm: () => actions.initializeForm({ formSchema }),
  changeFormField: (value: any, field: string) =>
    actions.changeFormField({ value, field, formSchema }),
  focusField: (field: string) => actions.focusField({ field, formSchema }),
  blurField: (field: string) => actions.blurField({ field, formSchema }),
})

export const createFieldActions = (
  formSchema: Form.AnyFormSchema,
  field: string,
) => ({
  changeFormField: (value: any) =>
    actions.changeFormField({ value, field, formSchema }),
  focusField: () => actions.focusField({ field, formSchema }),
  blurField: () => actions.blurField({ field, formSchema }),
})
