import { createStore, combineReducers, applyMiddleware } from "redux"
import { formReducer, FormState } from "ts-redux-form"
import {
  AuthenticationModel,
  authenticationFormSchema,
} from "examples/authentication/form-schema"
import { asyncValidationMiddleware } from "src/async-validation-middleware"

type GlobalState = {
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
