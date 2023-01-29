import type { Context } from "./StateMachine.types";

export const initialContext: Context = {
  formFields: {
    input_filename: '',
    input_enc_key: '',
    input_dist_key: '',
    input_msg: '',
    input_fetched_msg: '',
  },
  isFetchConfigValid: false,
  isEmbedConfigValid: false,
  availableEmbedFreeSpacePercent: null,
};
