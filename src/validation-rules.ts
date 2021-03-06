export enum RuleValidity {
  unknown = "unknown",
  valid = "valid",
  invalid = "invalid",
  pending = "pending",
}

export type ValidityFlags = {
  isInvalid: boolean
  isValid: boolean
}

export const getOverallValidity = (xs: RuleValidity[]): RuleValidity =>
  //prettier-ignore
  xs.some(x => x === RuleValidity.invalid) ? RuleValidity.invalid :
  xs.some(x => x === RuleValidity.pending) ? RuleValidity.pending :
  xs.some(x => x === RuleValidity.unknown) ? RuleValidity.unknown :
  RuleValidity.valid

export const mapToValidityFlags = (validity: RuleValidity) => ({
  isInvalid: validity === RuleValidity.invalid,
  isValid: validity === RuleValidity.valid,
})

export type SyncRules<Value> = { [i: string]: (value: Value) => boolean }

export type AsyncRules<Value> = {
  [role: string]: (value: Value) => Promise<boolean>
}

export type Rules<Value> = {
  sync?: SyncRules<Value>
  async?: AsyncRules<Value>
}
