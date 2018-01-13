export enum RuleValidity {
  valid = "valid",
  invalid = "invalid",
  pending = "pending",
}

export const getOverallValidity = (xs: RuleValidity[]): RuleValidity =>
  //prettier-ignore
  xs.some(x => x === RuleValidity.invalid) ? RuleValidity.invalid :
  xs.some(x => x === RuleValidity.pending) ? RuleValidity.pending :
  RuleValidity.valid

export type SyncRules<Value> = { [i: string]: (value: Value) => boolean }

export type AsyncRules<Value> = {
  [role: string]: (value: Value) => Promise<boolean>
}

export type Rules<Value> = {
  sync?: SyncRules<Value>
  async?: AsyncRules<Value>
}
