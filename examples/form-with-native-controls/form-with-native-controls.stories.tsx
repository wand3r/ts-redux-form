import * as React from "react"
import { storiesOf } from "@storybook/react"
import { FormWithNativeControls } from "./form-with-native-controls"

storiesOf("Form with native controls", module).add("Default", () => (
  <FormWithNativeControls />
))
