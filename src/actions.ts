import { AnyFormSchema } from "./form"
import { actionCreatorFactory } from "typescript-fsa"

const actionCreator = actionCreatorFactory("FORM")

export const initializeForm = actionCreator<{
  formSchema: AnyFormSchema
}>("INITIALIZE")

export const changeFormField = actionCreator<{
  value: any
  field: string
  formSchema: AnyFormSchema
}>("CHANGE_FIELD")

export const focusField = actionCreator<{
  field: string
  formSchema: AnyFormSchema
}>("FOCUS_FIELD")

export const blurField = actionCreator<{
  field: string
  formSchema: AnyFormSchema
}>("BLUR_FIELD")

export const setFormFieldAsyncValidity = actionCreator.async<
  { field: string; formSchema: AnyFormSchema },
  { result: { [rule: string]: boolean } },
  any
>("SET_FIELD_ASYNC_VALIDITY")
