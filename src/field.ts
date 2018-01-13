import * as O from "ts-object"
import {
  Rules,
  SyncRules,
  AsyncRules,
  RuleValidity,
  getOverallValidity,
} from "./validation-rules"

export type FieldValidity = {
  [rule: string]: RuleValidity
}

export type FieldSchema<Value> = {
  rules: Rules<Value>
  initialValue: Value
}

export type FieldState<T> = {
  value: T
  initialValue: T
  focus: boolean
  touched: boolean
  leaved: boolean
  changed: boolean
  validity: FieldValidity
}

export type AnyFieldState = FieldState<any>

export const isFieldValid = (field: AnyFieldState): boolean =>
  O.every((validity) => validity === RuleValidity.valid, field.validity)

export const getFieldOverallValidity = (field: FieldState<any>): RuleValidity =>
  getOverallValidity(O.values(field.validity))

export const isFieldValidationInProgress = (field: AnyFieldState): boolean =>
  O.some((validity) => validity === RuleValidity.pending, field.validity)

export const getFieldErros = (field: AnyFieldState): string[] =>
  Object.keys(
    O.filter((validity) => validity === RuleValidity.invalid, field.validity),
  )

export type FieldInfo = {
  initialValue: any
  value: any
  focus: boolean
  changed: boolean
  touched: boolean
  validity: FieldValidity
  overallValidity: RuleValidity
  anyPendingValidation: boolean
  errors: string[]
}
export const getFieldInfo = (field: AnyFieldState): FieldInfo => {
  const { value, validity, focus, initialValue, changed, touched } = field
  return {
    initialValue,
    value,
    focus,
    changed,
    touched,
    validity,
    overallValidity: getFieldOverallValidity(field),
    anyPendingValidation: isFieldValidationInProgress(field),
    errors: getFieldErros(field),
  }
}

export const initializeField = <T>({
  initialValue,
  rules,
}: FieldSchema<T>): FieldState<T> => ({
  initialValue,
  value: initialValue,
  changed: false,
  touched: false,
  leaved: false,
  focus: false,
  validity: {
    ...validateSyncRules(initialValue, rules.sync),
    ...setPendingAsyncRules(rules.async),
  },
})

export const changeFieldValue = <T>(
  value: any,
  field: FieldState<T>,
  rules: Rules<T>,
): FieldState<T> => ({
  ...field,
  value,
  changed: true,
  validity: {
    ...validateSyncRules(value, rules.sync),
    ...setPendingAsyncRules(rules.async),
  },
})

export const focusField = <T>(field: FieldState<T>): FieldState<T> => ({
  ...field,
  focus: true,
  touched: true,
})

export const blurField = <T>(field: FieldState<T>): FieldState<T> => ({
  ...field,
  focus: false,
  leaved: true,
})

export const setAsyncValidationResults = <T>(
  result: { [rule: string]: boolean },
  field: FieldState<T>,
): FieldState<T> => ({
  ...field,
  validity: {
    ...field.validity,
    ...O.map(
      (validity) => (validity ? RuleValidity.valid : RuleValidity.invalid),
      result,
    ),
  },
})

const validateSyncRules = <T>(value: T, rules: SyncRules<T> | undefined) =>
  O.map(
    (rule) => (rule(value) ? RuleValidity.valid : RuleValidity.invalid),
    rules || {},
  )

const setPendingAsyncRules = <T>(rules: AsyncRules<T> | undefined) =>
  O.map(() => RuleValidity.pending, rules || {})
