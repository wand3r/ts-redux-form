import React from "react"
import { FormWithNativeControls } from "./form-with-native-controls"
import { Provider } from "react-redux"
import { store } from "./store"

const storeInstance = store()

export const App = () => (
  <Provider store={storeInstance}>
    <div>
      <FormWithNativeControls />
    </div>
  </Provider>
)
