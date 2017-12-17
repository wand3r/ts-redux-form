import * as React from "react"
import { storiesOf } from "@storybook/react"
import { number } from "@storybook/addon-knobs"
import { FizzBuzzCounter, FizzBuzzValue } from "./component"

const numberProp = (i: number) => number("number", i)

storiesOf("fizz-buzz", module)
  .add("FizzBuzzCounter", () => <FizzBuzzCounter />)
  .add("FizzBuzzValue 1", () => <FizzBuzzValue number={numberProp(1)} />)
