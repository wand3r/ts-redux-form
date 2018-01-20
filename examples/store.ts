import { createStore, combineReducers, applyMiddleware } from "redux"
import {
  formReducer,
  FormState,
  asyncValidationMiddleware,
} from "ts-redux-form"
import {
  AuthenticationModel,
  authenticationFormSchema,
} from "./authentication/form-schema"

export type GlobalState = {
  authentication: {
    form: FormState<AuthenticationModel>
  }
}

const rootReducer = combineReducers<GlobalState>({
  authentication: combineReducers({
    form: formReducer(authenticationFormSchema),
  }),
})

export const store = () =>
  createStore(rootReducer, applyMiddleware(asyncValidationMiddleware(200)))
