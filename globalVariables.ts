type Environment = "development" | "production"

function isEnvironment(arg: any): arg is Environment {
  return arg == "development" || arg == "production"
}

export const getEnvironment = () =>
  isEnvironment(process.env.NODE_ENV)
    ? (process.env.NODE_ENV as Environment)
    : "development"
