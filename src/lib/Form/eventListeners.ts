import { dialog } from '@tauri-apps/api';
import StateMachine from '../../store/StateMachine';

export const onOpenImageButtonClick = async () => {
  const filepath = await dialog.open({
    title: 'Open Image',
    filters: [{ name: 'Bitmap', extensions: ['bmp'] }]
  });

  if (filepath && typeof filepath === 'string') {
    StateMachine.service.send({ type: 'FILE_SELECTED', path: filepath });
  }
}

export const onEmbedMessageButtonClick = async () => {
  StateMachine.service.send({ type: 'EMBED_BUTTON_CLICKED' });
}

export const onFetchMessageButtonClick = async () => {
  StateMachine.service.send({ type: 'FETCH_BUTTON_CLICKED' });
}

export const onFormInputChange = (event: Event) => {
  const { name, value } = event.target as HTMLInputElement;
  StateMachine.service.send({ type: 'FORM_FIELD_CHANGED', name, value });
}
