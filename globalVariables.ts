type Environment = "development" | "production"

function isEnvironment(arg: any): arg is Environment {
  return arg == "development" || arg == "production"
}

export const parseEnvironment = (environment: any): Environment => {
  if (isEnvironment(environment)) return environment
  else throw Error("Invalid environment")
}

export const getEnvironment = () =>
  isEnvironment(process.env.NODE_ENV)
    ? (process.env.NODE_ENV as Environment)
    : "development"
