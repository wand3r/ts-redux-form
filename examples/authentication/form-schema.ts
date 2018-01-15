import { FormSchema } from "ts-redux-form"

export type AuthenticationModel = {
  email: string
  password: string
}

export type AuthenticationFormSchema = FormSchema<AuthenticationModel>

export const authenticationFormSchema: AuthenticationFormSchema = {
  name: "authenticationForm",
  rules: {},
  fields: {
    email: {
      initialValue: "",
      rules: {
        sync: {
          moreThen4Chars: (str) => str.length > 4,
          lessThen30Chars: (str) => str.length < 30,
          containsAtSign: (str) => str.includes("@"),
        },
        async: {
          isUnique: (str) =>
            wait(300).then(() => ["foo@bar.com"].every((x) => x !== str)),
        },
      },
    },
    password: {
      initialValue: "",
      rules: {
        sync: {
          moreThen8Chars: (str) => str.length > 8,
          lessThen30Chars: (str) => str.length < 30,
          containsLowerCaseLetter: (str) => /[a-z]/.test(str),
          containsUpperCaseLetter: (str) => /[A-Z]/.test(str),
          containsNumber: (str) => /\d/.test(str),
        },
      },
    },
  },
}

const wait = (ms: number) =>
  new Promise((resolve, reject) => setTimeout(resolve, ms))
