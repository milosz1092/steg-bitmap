import { invoke, dialog } from '@tauri-apps/api';
import type { Context, FileSelectedEvent, EmbedButtonClickEvent, FetchButtonClickEvent, FormFieldChangedEvent } from './StateMachine.types';

export const readImage = async (_: Context, event: FileSelectedEvent) => {
  const read_result = await invoke<boolean>('read_file', { filepath: event.path });

  if (read_result) {
    return { path: event.path }
  } else {
    return Promise.reject();
  }
}

export const embedMessage = async (context: Context, event: EmbedButtonClickEvent) => {
  const { input_msg, input_enc_key, input_dist_key } = context.formFields;
  const embed_result = await invoke<boolean>(
    'embed_message',
    {
      message: input_msg,
      encryptionKey: input_enc_key,
      distributionKey: input_dist_key
    }
  );

  if (embed_result) {
    return Promise.resolve();
  } else {
    return Promise.reject();
  }
}

export const saveImageToFile = async () => {
  const filepath = await dialog.save({
    title: 'Save Image',
    filters: [{ name: 'Bitmap', extensions: ['bmp'] }]
  });

  if (!filepath) {
    return Promise.reject();
  }

  const save_result = await invoke('save_file', { filepath });

  if (save_result) {
    return Promise.resolve();
  } else {
    return Promise.reject();
  }
}

export const fetchMessageFromImage = async (context: Context, event: FetchButtonClickEvent) => {
  const { input_enc_key, input_dist_key } = context.formFields;
  const fetch_result = await invoke<string>(
    'fetch_message',
    {
      encryptionKey: input_enc_key,
      distributionKey: input_dist_key,
    }
  );

  return { message: fetch_result }
}

export const getAvailableEmbedFreeSpacePercent = async (context: Context, event: FormFieldChangedEvent) => {
  const message = context.formFields[event.name];

  const result = await invoke<number>(
    'get_embed_free_space_percent',
    {
      message: message,
    }
  );

  return { freeSpacePercent: result };
}
