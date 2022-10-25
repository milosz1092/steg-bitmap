import type { Context } from './StateMachine.types';

type FormFields = (keyof Context['formFields'])[];

const validateCommonConfig = (context: Context): boolean => {
  const commonFields: FormFields = ['input_filename', 'input_dist_key', 'input_enc_key'];
  const isCommonConfigValid = commonFields.some((field) => !context.formFields[field]) === false;

  return isCommonConfigValid;
}

export const validateEmbedConfig = (context: Context): boolean => {
  const embedFields: FormFields = ['input_msg'];
  const isEmbedConfigValid = embedFields.some((field) => !context.formFields[field]) === false;
  const isCommonConfigValid = validateCommonConfig(context);

  return isEmbedConfigValid && isCommonConfigValid;
}

export const validateFetchConfig = (context: Context): boolean => {
  return validateCommonConfig(context);
}
