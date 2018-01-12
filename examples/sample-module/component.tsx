import React from "react"
import { fizzBuzz } from "./index"
import "./style"

const colorsMap = {
  Fizz: "yellow",
  Buzz: "blue",
  FizzBuzz: "green",
}

export const FizzBuzzValue = ({ number }: { number: number }) => {
  const fizzBuzzValue = fizzBuzz(number)
  const colorClass =
    typeof fizzBuzzValue === "string" ? colorsMap[fizzBuzzValue] : ""
  return <span className={colorClass}>{fizzBuzzValue}</span>
}

export class FizzBuzzCounter extends React.Component<{}, { counter: number }> {
  state = {
    counter: 1,
  }
  increment = () =>
    this.setState(({ counter }) => ({
      counter: counter + 1,
    }))
  render() {
    const { counter } = this.state
    return (
      <div className="fizz-buzz">
        <button onClick={this.increment}>Incremenet!</button>
        <FizzBuzzValue number={counter} />
      </div>
    )
  }
}
