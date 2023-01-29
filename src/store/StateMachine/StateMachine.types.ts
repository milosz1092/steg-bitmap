import { FormIds as ids } from '$src/App.static';

export interface Context {
  formFields: {
    [ids.INPUT_FILENAME]: string;
    [ids.INPUT_ENC_KEY]: string;
    [ids.INPUT_DIST_KEY]: string;
    [ids.INPUT_MSG]: string;
    [ids.INPUT_FETCHED_MSG]: string;
  };
  isEmbedConfigValid: boolean;
  isFetchConfigValid: boolean;
  imageCapacityPercent: number | null;
}

export type Services = {
  readImage: {
    data: { path: string };
  },
  fetchMessageFromImage: {
    data: { message: string };
  },
  getImageCapacityPercent: {
    data: { freeSpacePercent: number };
  }
}

export type SavingFileSuccessEvent = {
  type: 'SAVING_FILE_SUCCESS';
};

export type SavingFileFailureEvent = {
  type: 'SAVING_FILE_FAILURE';
};

export type FetchButtonClickEvent = {
  type: 'FETCH_BUTTON_CLICKED';
};

export type EmbedButtonClickEvent = {
  type: 'EMBED_BUTTON_CLICKED';
};

export type FileSelectedEvent = {
  type: 'FILE_SELECTED';
  path: string;
};

export type StartImageReadiingEvent = {
  type: 'START_IMAGE_READING';
  path: string;
};

export type FormFieldChangedEvent = {
  type: 'FORM_FIELD_CHANGED';
  name: string;
  value: string;
};

export type CheckImageCapacityEvent = {
  type: 'CHECK_IMAGE_CAPACITY';
  message: string;
};


export type Events =
  | SavingFileSuccessEvent
  | SavingFileFailureEvent
  | FetchButtonClickEvent
  | EmbedButtonClickEvent
  | FileSelectedEvent
  | FormFieldChangedEvent
  | StartImageReadiingEvent
  | CheckImageCapacityEvent;
