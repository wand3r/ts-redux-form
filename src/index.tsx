import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

const render = () => {
  const { App } = require("./app");
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById("app"),
  );
};

render();

if (module.hot) {
  module.hot.accept("./app", () => {
    render();
  });
}
