<script>
  import { FormIds as ids } from "$src/App.static";
  import {
    onEmbedMessageButtonClick,
    onFetchMessageButtonClick,
    onFormInputChange,
    onOpenImageButtonClick,
  } from "./eventListeners";
  import StateMachine from "$store/StateMachine";
  import { store$ } from "$subjects/stateSubjects";
  import { map } from "rxjs/operators";
  import TextInput from "$lib/TextInput/TextInput.svelte";

  const isUserActionAllowed$ = StateMachine.observer.pipe(
    map((machine) =>
      machine.matches("config_actions.user_actions.form_editing")
    )
  );
</script>

<div id="form">
  <fieldset>
    <legend>Select Bitmap</legend>
    <TextInput
      label="File:"
      id={ids.INPUT_FILENAME}
      readonly
      bind:value={$store$.formFields[ids.INPUT_FILENAME]}
    />
    <button
      disabled={!$isUserActionAllowed$}
      on:click={onOpenImageButtonClick}
      id={ids.BTN_OPEN}>Open</button
    >
  </fieldset>

  <fieldset class="vertical">
    <legend>Configuration</legend>
    <TextInput
      label="Encryption key:"
      id={ids.INPUT_ENC_KEY}
      type="password"
      on:input={onFormInputChange}
      bind:value={$store$.formFields[ids.INPUT_ENC_KEY]}
    />

    <TextInput
      label="Distribution key:"
      id={ids.INPUT_DIST_KEY}
      type="password"
      on:input={onFormInputChange}
      bind:value={$store$.formFields[ids.INPUT_DIST_KEY]}
    />
  </fieldset>

  <fieldset class="vertical">
    <legend>Embedding</legend>
    <TextInput
      element="textarea"
      label="Input message:"
      id={ids.INPUT_MSG}
      on:input={onFormInputChange}
      bind:value={$store$.formFields[ids.INPUT_MSG]}
    />
    <button
      disabled={!$store$.isEmbedConfigValid || !$isUserActionAllowed$}
      on:click={onEmbedMessageButtonClick}
      id={ids.BTN_EMBED}>Embed & Save</button
    >
  </fieldset>

  <fieldset class="vertical">
    <legend>Fetching</legend>
    <TextInput
      readonly
      element="textarea"
      label="Output message:"
      id={ids.INPUT_FETCHED_MSG}
      on:input={onFormInputChange}
      bind:value={$store$.formFields[ids.INPUT_FETCHED_MSG]}
    />
    <button
      disabled={!$store$.isFetchConfigValid || !$isUserActionAllowed$}
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
