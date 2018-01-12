import React from "react"
import ReactDOM from "react-dom"
import { AppContainer } from "react-hot-loader"
import { App } from "./app"

const render = (Component: React.ComponentType) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById("app"),
  )
}

render(App)

if (module.hot) {
  module.hot.accept("./app", () => {
    render(App)
  })
}
