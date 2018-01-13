import { AnyFormState, formReducer } from "./form"
import { reducerWithInitialState } from "typescript-fsa-reducers"
import * as actions from "./actions"

export type FormsState = {
  forms: { [formName: string]: AnyFormState }
}

export const getForm = (form: string, state: FormsState) => state.forms[form]

export const formsReducer = reducerWithInitialState({} as FormsState["forms"])
  .casesWithAction(
    [
      actions.initializeForm,
      actions.focusField,
      actions.blurField,
      actions.changeFormField,
    ],
    (state, action) => {
      const formName = action.payload.formSchema.name
      return {
        ...state,
        [formName]: formReducer(state[formName], action),
      }
    },
  )
  .caseWithAction(actions.setFormFieldAsyncValidity.done, (state, action) => {
    const formName = action.payload.params.formSchema.name
    return {
      ...state,
      [formName]: formReducer(state[formName], action),
    }
  })
