<script lang="ts">
  import { FormIds as ids } from "$src/App.static";
  import { store$ } from "$subjects/stateSubjects";
  import { map } from "rxjs/operators";

  const imageCapacity$ = store$.pipe(
    map((store) => {
      const capacity = store.imageCapacityPercent;
      return Math.min(1, capacity);
    })
  );

  const isCalculationPossible$ = store$.pipe(
    map(
      (store) =>
        store.formFields[ids.INPUT_MSG] && store.formFields[ids.INPUT_FILENAME]
    )
  );

  const imageCapacityIndicatorStyles$ = store$.pipe(
    map((_) => {
      return `
          transform: scaleX(${
            $isCalculationPossible$ ? Math.min(1 - $imageCapacity$, 1) : 0
          });
          background-color: ${
            $imageCapacity$ < 0
              ? "red"
              : $imageCapacity$ < 0.3
              ? "orange"
              : $imageCapacity$ < 0.35
              ? "yellow"
              : "green"
          }
        `;
    })
  );
</script>

<div>
  <div
    style="margin: 0; font-size: 0.9rem; opacity: {$isCalculationPossible$
      ? 1
      : 0};"
  >
    Ramaining capacity: {$imageCapacity$ < 0
      ? 0
      : ($imageCapacity$ * 100).toFixed(0)}%
  </div>
  <div
    id="remaining_capacity_indicator"
    style={$imageCapacityIndicatorStyles$}
  />
</div>

<style>
  #remaining_capacity_indicator {
    height: 0.2rem;
    width: 100%;
    margin: 0 0 1.5rem 0;
    transition: 0.5s ease-in-out;
    transform-origin: bottom left;
    opacity: 0.7;
  }
</style>
