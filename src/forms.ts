import { AnyFormState, formReducer, FormState } from "./form"
import { reducerWithInitialState } from "typescript-fsa-reducers"
import { actions } from "./actions"

export type FormsState = { [formName: string]: AnyFormState }

export const getForm = <Model>(form: string) => (state: FormsState) =>
  state[form] as FormState<Model>

export const formsReducer = reducerWithInitialState<FormsState>({})
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
