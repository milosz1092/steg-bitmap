import { from } from "rxjs";
import { interpret } from "xstate";
import StateMachineConfig from './StateMachine.config';

class StateMachine {
  service = interpret(StateMachineConfig, { devTools: true }).onTransition((state) => {
    console.log(state.value);
  });

  observer = from(this.service);

  start() {
    this.service.start();
  }
}

export default new StateMachine();
