import { from } from "rxjs";
import { interpret } from "xstate";
import StateMachineConfig from './StateMachine.config';
import { IS_DEVELOPMENT } from '$src/static';

class StateMachine {
  service = interpret(StateMachineConfig, { devTools: IS_DEVELOPMENT }).onTransition((state) => {
    IS_DEVELOPMENT && console.log(state.value);
  });

  observer = from(this.service);

  start() {
    this.service.start();
  }
}

export default new StateMachine();
