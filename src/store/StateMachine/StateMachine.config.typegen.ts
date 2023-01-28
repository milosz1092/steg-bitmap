
// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    "done.invoke.embed_message": { type: "done.invoke.embed_message"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
    "done.invoke.fetch_message": { type: "done.invoke.fetch_message"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
    "done.invoke.read_file": { type: "done.invoke.read_file"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
    "done.invoke.save_file": { type: "done.invoke.save_file"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
    "error.platform.embed_message": { type: "error.platform.embed_message"; data: unknown };
    "error.platform.fetch_message": { type: "error.platform.fetch_message"; data: unknown };
    "error.platform.read_file": { type: "error.platform.read_file"; data: unknown };
    "error.platform.save_file": { type: "error.platform.save_file"; data: unknown };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    "embedMessage": "done.invoke.embed_message";
    "fetchMessageFromImage": "done.invoke.fetch_message";
    "readImage": "done.invoke.read_file";
    "saveImageToFile": "done.invoke.save_file";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    "clearRelevantFormFieldsOnEmbeddingSuccess": "done.invoke.save_file";
    "clearRelevantFormFieldsOnFetchingStarted": "FETCH_BUTTON_CLICKED";
    "clearRelevantFormFieldsOnImageOpen": "FILE_SELECTED";
    "insertDecryptedMessageIntoForm": "done.invoke.fetch_message";
    "insertImageFilenameIntoForm": "done.invoke.read_file";
    "showEmbeddingFailureAlert": "error.platform.embed_message";
    "showEmbeddingSuccessInfo": "done.invoke.save_file";
    "showFetchingCompletedInfo": "done.invoke.fetch_message";
    "showSavingFileFailureAlert": "error.platform.save_file";
    "updateFormFieldsContext": "FORM_FIELD_CHANGED";
    "validateFormFields": "FORM_FIELD_CHANGED" | "done.invoke.read_file";
  };
  eventsCausingDelays: {

  };
  eventsCausingGuards: {
    "isEmbedInfoReady": "EMBED_BUTTON_CLICKED";
    "isFetchingInfoReady": "FETCH_BUTTON_CLICKED";
  };
  eventsCausingServices: {
    "embedMessage": "EMBED_BUTTON_CLICKED";
    "fetchMessageFromImage": "FETCH_BUTTON_CLICKED";
    "readImage": "FILE_SELECTED";
    "saveImageToFile": "done.invoke.embed_message";
  };
  matchesStates: "config_actions" | "config_actions.image_opening" | "config_actions.image_opening.idle" | "config_actions.image_opening.reading_image" | "config_actions.user_actions" | "config_actions.user_actions.form_editing" | "embedding_message" | "embedding_message.embedding_in_progress" | "embedding_message.saving_file_in_progress" | "fetching_message" | "fetching_message.fetching_in_progress" | {
    "config_actions"?: "image_opening" | "user_actions" | {
      "image_opening"?: "idle" | "reading_image";
      "user_actions"?: "form_editing";
    };
    "embedding_message"?: "embedding_in_progress" | "saving_file_in_progress";
    "fetching_message"?: "fetching_in_progress";
  };
  tags: never;
}
