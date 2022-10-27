import { map } from 'rxjs/operators';
import StateMachine from '$store/StateMachine';

const store$ = StateMachine.observer.pipe(map((machine) => machine.context));
store$["set"] = () => { };

export { store$ };
