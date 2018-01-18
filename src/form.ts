import { reducerWithoutInitialState } from "typescript-fsa-reducers"
import { RuleValidity, getOverallValidity, Rules } from "./validation-rules"
import { actions } from "./actions"
import * as O from "ts-object"
import {
  changeFieldValue,
  setAsyncValidationResults,
  initializeField,
  getFieldInfo,
  FieldInfo,
  FieldState,
  focusField,
  blurField,
  FieldSchema,
} from "./field"

export type FormState<Model> = {
  fields: { [P in keyof Model]: FieldState<Model[P]> }
}

export type AnyFormState = FormState<{ [field: string]: any }>

export type FormSchema<Model> = {
  _id: symbol
  name: string
  rules: Rules<undefined>
  fields: { [P in keyof Model]: FieldSchema<Model[P]> }
}

export type AnyFormSchema = FormSchema<{ [i: string]: any }>

export type FormInfo<Model> = {
  fields: { [P in keyof Model]: FieldInfo<Model[P]> }
  focus: boolean
  changed: boolean
  touched: boolean
  overallValidity: RuleValidity
}
export const getFormInfo = <Model>(form: FormState<Model>): FormInfo<Model> => {
  const fields = O.map((field) => getFieldInfo(field), form.fields)
  return {
    fields,
    focus: O.some((field) => field.focus, fields),
    changed: O.some((field) => field.changed, fields),
    touched: O.some((field) => field.touched, fields),
    overallValidity: getOverallValidity(
      O.mapToArray((field) => field.overallValidity, fields),
    ),
  }
}

export const formReducer = reducerWithoutInitialState<AnyFormState>()
  .case(actions.changeFormField, (state, { field, value, formSchema }) => {
    //TODO: add form level validation
    return {
      ...state,
      fields: {
        ...state.fields,
        [field]: changeFieldValue(
          value,
          state.fields[field],
          formSchema.fields[field].rules,
        ),
      },
    }
  })
  .case(
    actions.setFormFieldAsyncValidity.done,
    (state, { result: { result }, params: { field } }) => {
      //TODO: add form level validation
      return {
        ...state,
        fields: {
          ...state.fields,
          [field]: setAsyncValidationResults(result, state.fields[field]),
        },
      }
    },
  )
  .case(actions.initializeForm, (state, { formSchema }) => {
    //TODO: add form level validation
    return {
      ...state,
      fields: O.map(initializeField, formSchema.fields),
    }
  })
  .caseWithAction(actions.focusField, (state, { payload: { field } }) => ({
    ...state,
    fields: {
      ...state.fields,
      [field]: focusField(state.fields[field]),
    },
  }))
  .caseWithAction(actions.blurField, (state, { payload: { field } }) => ({
    ...state,
    fields: {
      ...state.fields,
      [field]: blurField(state.fields[field]),
    },
  }))
