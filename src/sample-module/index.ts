type FizzBuzzType = number | "Fizz" | "Buzz" | "FizzBuzz";

export const fizzBuzz: (index: number) => FizzBuzzType = index => {
  if (index % 3 === 0 && index % 5 === 0) return "FizzBuzz";
  if (index % 3 === 0) return "Fizz";
  if (index % 5 === 0) return "Buzz";
  return index;
};
