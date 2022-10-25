import { inspect } from "@xstate/inspect";
import './app.css';
import App from './App.svelte';
import StateMachine from './store/StateMachine';


inspect({
  url: "https://statecharts.io/inspect",
  iframe: false
});

StateMachine.start();

const app = new App({
  target: document.getElementById('app')
});

export default app;
