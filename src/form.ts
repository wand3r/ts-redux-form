import { reducerWithInitialState } from "typescript-fsa-reducers"
import {
  RuleValidity,
  getOverallValidity,
  Rules,
  ValidityFlags,
  mapToValidityFlags,
} from "./validation-rules"
import { actions, isFormAction } from "./actions"
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
import { Omit } from "type-zoo"
import { AnyAction } from "typescript-fsa"

export type FormState<Model> = {
  fields: { [P in keyof Model]: FieldState<Model[P]> }
}

export type AnyFormState = FormState<{ [field: string]: any }>

export type FormSchema<Model> = {
  /** @internal */
  _id: symbol
  rules: Rules<undefined>
  fields: { [P in keyof Model]: FieldSchema<Model[P]> }
}

export const createSchema = <TModel>(
  formSchema: Omit<FormSchema<TModel>, "_id">,
): FormSchema<TModel> => ({
  _id: Symbol(),
  ...formSchema,
})

export type AnyFormSchema = FormSchema<{ [i: string]: any }>

export type FormInfo<Model> = {
  fields: { [P in keyof Model]: FieldInfo<Model[P]> }
  focus: boolean
  changed: boolean
  touched: boolean
  validity: RuleValidity
} & ValidityFlags
export const getFormInfo = <Model>(form: FormState<Model>): FormInfo<Model> => {
  const fields = O.map((field) => getFieldInfo(field), form.fields)
  const validity = getOverallValidity(
    O.mapToArray((field) => field.validity, fields),
  )
  return {
    fields,
    focus: O.some((field) => field.focus, fields),
    changed: O.some((field) => field.changed, fields),
    touched: O.some((field) => field.touched, fields),
    validity,
    ...mapToValidityFlags(validity),
  }
}

const initializeForm = <TModel>(
  formSchema: FormSchema<TModel>,
): FormState<TModel> => ({
  fields: O.map((field) => initializeField(field), formSchema.fields),
})

export const formReducer = <TModel>(formSchema: FormSchema<TModel>) => {
  const initialState = initializeForm(formSchema)
  const reducer = reducerWithInitialState<AnyFormState>(initialState)
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
    .case(actions.setFormFieldAsyncValidity, (state, { field, result }) => {
      //TODO: add form level validation
      return {
        ...state,
        fields: {
          ...state.fields,
          [field]: setAsyncValidationResults(result, state.fields[field]),
        },
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

  return (state: AnyFormState = initialState, action: AnyAction) => {
    if (!isFormAction(action)) return state
    if (action.payload.formSchema._id !== formSchema._id) return state
    else return reducer(state, action)
  }
}
