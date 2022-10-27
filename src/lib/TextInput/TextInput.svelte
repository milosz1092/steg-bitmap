<script lang="ts">
  export let element: "textarea" | "input" = "input";
  export let label = "";
  export let id: string;
</script>

{#if label}
  <label for={id}>{label}</label>
{/if}
<svelte:element this={element} name={id} {id} {...$$restProps} on:input />
