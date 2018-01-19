import { createStore, combineReducers, applyMiddleware } from "redux"
import { formReducer, FormState } from "ts-redux-form"
import { AuthenticationModel } from "examples/authentication/form-schema"
import { asyncValidationMiddleware } from "src/async-validation-middleware"

type StoreModel = {
  authentication: {
    form: FormState<AuthenticationModel>
  }
}

const rootReducer = combineReducers<StoreModel>({
  authentication: combineReducers({
    form: formReducer,
  }),
})

export const store = () =>
  createStore(rootReducer, applyMiddleware(asyncValidationMiddleware(200)))
