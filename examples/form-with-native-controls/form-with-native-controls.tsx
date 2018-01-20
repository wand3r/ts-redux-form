import React, { SFC } from "react"
import { FormInfo, BindedActionCreators } from "ts-redux-form"
import { connect } from "react-redux"
import { getFormInfo, createFormActionsWithDispatch } from "ts-redux-form"
import "./form-with-native-controls.style"
import {
  AuthenticationModel,
  authenticationFormSchema,
} from "../authentication/form-schema"
import { GlobalState } from "../store"

const beautify = require("json-beautify")

type FormWithNativeControlsProps = {
  form: FormInfo<AuthenticationModel>
  actions: BindedActionCreators<AuthenticationModel>
}

const FormWithNativeControlsView: SFC<FormWithNativeControlsProps> = ({
  form,
  form: { fields: { email, password } },
  actions: { fields: { email: emailActions, password: passwordActions } },
}) => (
  <div className="form-with-native-controls">
    <label>Email</label>
    <input
      type="text"
      value={email.value}
      onFocus={emailActions.focus}
      onBlur={emailActions.blur}
      onChange={(e) => emailActions.change(e.target.value)}
    />
    <label>Password</label>
    <input
      type="password"
      value={password.value}
      onFocus={passwordActions.focus}
      onBlur={passwordActions.blur}
      onChange={(e) => passwordActions.change(e.target.value)}
    />
    <pre>{beautify(form, null, 4, 200)}</pre>
  </div>
)

export const FormWithNativeControls = connect(
  (state: GlobalState) => ({
    form: getFormInfo(state.authentication.form),
  }),
  (dispatch) => ({
    actions: createFormActionsWithDispatch(authenticationFormSchema)(dispatch),
  }),
)(FormWithNativeControlsView)
