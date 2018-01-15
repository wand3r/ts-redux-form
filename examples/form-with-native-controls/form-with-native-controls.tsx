import React, { Component } from "react"
import "./form-with-native-controls.style"

type FormWithNativeControlsProps = {}

type FormWithNativeControlsState = {}

export class FormWithNativeControls extends Component<
  FormWithNativeControlsProps,
  FormWithNativeControlsState
> {
  state = {}
  render() {
    return (
      <div className="form-with-native-controls">
        <label htmlFor="email">Email</label>
        <input name="email" type="text" />
        <label htmlFor="password">Password</label>
        <input name="password" type="password" />
        <div>
          <button>Login</button>
          <button>Clear</button>
        </div>
      </div>
    )
  }
}
