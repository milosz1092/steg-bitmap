<script>
  import { FormIds as ids } from "../../App.static";
  import {
    onEmbedMessageButtonClick,
    onFetchMessageButtonClick,
    onFormInputChange,
    onOpenImageButtonClick,
  } from "./eventListeners";
  import StateMachine from "../../store/StateMachine";
  import { map } from "rxjs/operators";

  const store$ = StateMachine.observer.pipe(map((machine) => machine.context));
</script>

<div id="form">
  <fieldset>
    <legend>Select Bitmap</legend>
    <label for={ids.INPUT_FILENAME}>File:</label>
    <input
      readonly
      type="text"
      id={ids.INPUT_FILENAME}
      name={ids.INPUT_FILENAME}
      value={$store$.formFields[ids.INPUT_FILENAME]}
    />
    <button on:click={onOpenImageButtonClick} id={ids.BTN_OPEN}>Open</button>
  </fieldset>

  <fieldset class="vertical">
    <legend>Configuration</legend>
    <label for={ids.INPUT_ENC_KEY}>Encryption key:</label>
    <input
      on:input={onFormInputChange}
      id={ids.INPUT_ENC_KEY}
      name={ids.INPUT_ENC_KEY}
      type="password"
      value={$store$.formFields[ids.INPUT_ENC_KEY]}
    />

    <label for={ids.INPUT_DIST_KEY}>Distribution key:</label>
    <input
      on:input={onFormInputChange}
      id={ids.INPUT_DIST_KEY}
      name={ids.INPUT_DIST_KEY}
      type="password"
      value={$store$.formFields[ids.INPUT_DIST_KEY]}
    />
  </fieldset>

  <fieldset class="vertical">
    <legend>Embedding</legend>
    <label for={ids.INPUT_MSG}>Input message:</label>
    <textarea
      on:input={onFormInputChange}
      id={ids.INPUT_MSG}
      name={ids.INPUT_MSG}
      value={$store$.formFields[ids.INPUT_MSG]}
    />
    <button
      disabled={!$store$.isEmbedConfigValid}
      on:click={onEmbedMessageButtonClick}
      id={ids.BTN_EMBED}>Embed & Save</button
    >
  </fieldset>

  <fieldset class="vertical">
    <legend>Fetching</legend>
    <label for={ids.INPUT_FETCHED_MSG}>Output message:</label>
    <textarea
      readonly
      id={ids.INPUT_FETCHED_MSG}
      value={$store$.formFields[ids.INPUT_FETCHED_MSG]}
    />
    <button
      disabled={!$store$.isFetchConfigValid}
      on:click={onFetchMessageButtonClick}
      id={ids.BTN_FETCH}>Fetch</button
    >
  </fieldset>
</div>

<style>
  #form {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    padding: 1rem;
  }

  #form > * {
    margin-bottom: 1.5rem;
  }
</style>
