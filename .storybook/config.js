import { configure, addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";

const reg = require.context("../src", true, /.stories.tsx$/);

function loadStories() {
  reg.keys().forEach(filename => reg(filename));
}

addDecorator(withKnobs);

configure(loadStories, module);
