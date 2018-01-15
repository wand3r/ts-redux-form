import { FormSchema } from "ts-redux-form"

export type AuthenticationModel = {
  email: string
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
          "contains@": (str) => str.includes("@"),
        },
        async: {
          isUnique: (str) =>
            wait(300).then(() => ["foo@bar.com"].every((x) => x !== str)),
        },
      },
    },
  },
}

const wait = (ms: number) =>
  new Promise((resolve, reject) => setTimeout(resolve, ms))
