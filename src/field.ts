import * as O from "ts-object"
import {
  Rules,
  SyncRules,
  AsyncRules,
  RuleValidity,
  getOverallValidity,
  ValidityFlags,
  mapToValidityFlags,
} from "./validation-rules"

export type RulesValidity = {
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
  rulesValidity: RulesValidity
}

export type AnyFieldState = FieldState<any>

export const getFieldOverallValidity = (field: FieldState<any>): RuleValidity =>
  getOverallValidity(O.values(field.rulesValidity))

export const isFieldValidationPending = (field: AnyFieldState): boolean =>
  O.some((validity) => validity === RuleValidity.pending, field.rulesValidity)

export const getFieldErros = (field: AnyFieldState): string[] =>
  Object.keys(
    O.filter(
      (validity) => validity === RuleValidity.invalid,
      field.rulesValidity,
    ),
  )

export type FieldInfo<Value> = {
  initialValue: Value
  value: any
  focus: boolean
  changed: boolean
  touched: boolean
  leaved: boolean
  rulesValidity: RulesValidity
  isValidationPending: boolean
  validity: RuleValidity
  errors: string[]
} & ValidityFlags

export const getFieldInfo = <Value>(
  field: FieldState<Value>,
): FieldInfo<Value> => {
  const validity = getFieldOverallValidity(field)
  return {
    ...field,
    validity,
    isValidationPending: isFieldValidationPending(field),
    errors: getFieldErros(field),
    ...mapToValidityFlags(validity),
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
  rulesValidity: markAllRulesAsUnknow(rules),
})

export const changeFieldValue = <T>(
  value: any,
  field: FieldState<T>,
  rules: Rules<T>,
): FieldState<T> => ({
  ...field,
  value,
  changed: true,
  rulesValidity: {
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
  rulesValidity: {
    ...field.rulesValidity,
    ...O.map(
      (validity) => (validity ? RuleValidity.valid : RuleValidity.invalid),
      result,
    ),
  },
})

const markAllRulesAsUnknow = <TValue>(rules: Rules<TValue>): RulesValidity =>
  O.map((_, ruleName) => RuleValidity.unknown, {
    ...(rules.sync || {}),
    ...(rules.async || {}),
  })

const validateSyncRules = <T>(
  value: T,
  rules: SyncRules<T> | undefined = {},
): RulesValidity =>
  O.map(
    (rule) => (rule(value) ? RuleValidity.valid : RuleValidity.invalid),
    rules,
  )

export const validateAsyncRules = <T>(
  value: T,
  asyncRules: AsyncRules<T> | undefined = {},
): Promise<{ [rule: string]: boolean }> => {
  const results = O.mapToArray(
    (rule, ruleName) =>
      rule(value).then((isValid) => ({
        ruleName,
        validity: isValid,
      })),
    asyncRules,
  )
  return Promise.all(results).then(
    O.fromArray((x) => x.ruleName, (x) => x.validity),
  )
}

const setPendingAsyncRules = <T>(
  rules: AsyncRules<T> | undefined,
): RulesValidity => O.map(() => RuleValidity.pending, rules || {})
