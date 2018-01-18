import { FormInfo, FormState } from "./form"
import { pipe } from "ts-function"
import * as Forms from "./forms"
import * as Form from "./form"

export { asyncValidationMiddleware } from "./async-validation-middleware"
export { actions, createFormActions, isFormAction } from "./actions"
export { formsReducer } from "./forms"
export { FormSchema, FormState, FormInfo, formReducer } from "./form"

export const getFormState = <Model>(
  formName: string,
  store: Forms.FormsState,
): FormState<Model> => Forms.getForm<Model>(formName)(store)

export const getFormInfo = <Model>(
  formName: string,
  store: Forms.FormsState,
): FormInfo<Model> =>
  pipe(store, Forms.getForm<Model>(formName), Form.getFormInfo)
