import { createMachine, assign } from 'xstate';
import type { Context, Events, Services } from './StateMachine.types';
import { initialContext } from './StateMachine.context';
import { validateEmbedConfig, validateFetchConfig } from './StateMachine.utils';
import { isEmbedInfoReady, isFetchingInfoReady } from './StateMachine.guards';
import { embedMessage, readImage, saveImageToFile, fetchMessageFromImage } from './StateMachine.services';
import { FormIds as ids } from '../../App.static';

export default createMachine(
  {
    id: 'StateMachine',
    initial: 'config_actions',
    context: initialContext,
    schema: {
      events: {} as Events,
      context: {} as Context,
      services: {} as Services,
    },
    tsTypes: {} as import("./StateMachine.config.typegen").Typegen0,
    predictableActionArguments: true,
    preserveActionOrder: true,
    states: {
      config_actions: {
        type: 'parallel',
        states: {
          user_actions: {
            initial: 'form_editing',
            states: {
              form_editing: {
                on: {
                  FILE_SELECTED: {
                    actions: 'clearRelevantFormFieldOnImageOpen',
                    target: '#StateMachine.config_actions.image_opening.reading_image',
                  },
                  FORM_FIELD_CHANGED: {
                    actions: ['updateFormFieldsContext', 'validateFormFields'],
                  },
                  FETCH_BUTTON_CLICKED: {
                    target: '#StateMachine.fetching_message',
                    cond: 'isFetchingInfoReady',
                  },
                  EMBED_BUTTON_CLICKED: {
                    target: '#StateMachine.embedding_message',
                    cond: 'isEmbedInfoReady',
                  },
                },
              },
            },
          },
          image_opening: {
            initial: 'idle',
            states: {
              idle: {},
              reading_image: {
                invoke: {
                  id: 'read_file',
                  src: 'readImage',
                  onDone: {
                    actions: 'insertImageFilenameIntoForm',
                    target: ['idle', '#StateMachine.config_actions.user_actions'],
                  },
                  onError: {
                    target: 'idle',
                  }
                }
              }
            },
          }
        }
      },
      embedding_message: {
        initial: 'embedding_in_progress',
        states: {
          embedding_in_progress: {
            invoke: {
              id: 'embed_message',
              src: 'embedMessage',
              onDone: {
                target: 'saving_file_in_progress'
              },
              onError: {
                actions: 'showEmbeddingFailureAlert',
                target: '#StateMachine.config_actions.user_actions',
              }
            }
          },
          saving_file_in_progress: {
            invoke: {
              src: 'saveImageToFile',
              id: 'save_file',
              onDone: {
                actions: [
                  'showEmbeddingSuccessInfo',
                  'clearRelevantFormFieldsOnEmbeddingSuccess'
                ],
                target: '#StateMachine.config_actions.user_actions.form_editing',
              },
              onError: {
                actions: 'showSavingFileFailureAlert',
                target: '#StateMachine.config_actions.user_actions.form_editing',
              }
            }
          },
        },
      },
      fetching_message: {
        initial: 'fetching_in_progress',
        states: {
          fetching_in_progress: {
            invoke: {
              src: 'fetchMessageFromImage',
              id: 'fetch_message',
              onDone: {
                target: '#StateMachine.config_actions.user_actions',
                actions: [
                  'showFetchingCompletedInfo',
                  'insertDecryptedMessageIntoForm',
                ],
              }
            }
          },
        },
      },
    },
  },
  {
    services: {
      readImage,
      embedMessage,
      saveImageToFile,
      fetchMessageFromImage,
    },
    guards: {
      isEmbedInfoReady,
      isFetchingInfoReady,
    },
    actions: {
      updateFormFieldsContext: assign({
        formFields: (context, event) => ({
          ...context.formFields,
          [event.name]: event.value,
        }),
      }),
      validateFormFields: assign({
        isEmbedConfigValid: (context) => validateEmbedConfig(context),
        isFetchConfigValid: (context) => validateFetchConfig(context),
      }),
      clearRelevantFormFieldOnImageOpen: assign({
        formFields: (context) => ({
          ...context.formFields,
          [ids.INPUT_FILENAME]: '',
          [ids.INPUT_FETCHED_MSG]: '',
        }),
      }),
      clearRelevantFormFieldsOnEmbeddingSuccess: assign({
        formFields: (context) => ({
          ...context.formFields,
          [ids.INPUT_FETCHED_MSG]: '',
          [ids.INPUT_MSG]: '',
          [ids.INPUT_FILENAME]: '',
        }),
      }),
      insertImageFilenameIntoForm: assign({
        formFields: (context, event) => ({
          ...context.formFields,
          [ids.INPUT_FILENAME]: event.data.path.replace(/^.*[\\\/]/, ''),
        }),
      }),
      insertDecryptedMessageIntoForm: assign({
        formFields: (context, event) => ({
          ...context.formFields,
          [ids.INPUT_FETCHED_MSG]: event.data.message,
        }),
      }),
      showEmbeddingFailureAlert: () => {
        alert('Embedding message failed!');
      },
      showEmbeddingSuccessInfo: () => {
        alert('Embedding is completed!');
      },
      showFetchingCompletedInfo: () => {
        alert('Fetching is completed!');
      },
      showSavingFileFailureAlert: () => {
        alert('Image with embedded message is not saved!');
      },
    },
  }
);
