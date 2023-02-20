// Controller Code

import AppView from './view/app.js';
import CounterView from './view/counter.js';
import TodosView from './view/todos.js';
import FiltersView from './view/filters.js';

import applyDiff from './applyDiff.js';
import registry from './registry.js';

import reducer from './model/reducer.js';

registry.add('app', AppView);
registry.add('todos', TodosView);
registry.add('counter', CounterView);
registry.add('filters', FiltersView);

const INITAL_STATE = {
  todos: [],
  currentFilter: 'All',
};

const store = Redux.createStore(
  reducer,
  INITAL_STATE,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const render = (state) => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector('#root');
    const newMain = registry.renderRoot(main, store.getState(), store.dispatch);
    applyDiff(document.body, main, newMain);
  });
};

store.subscribe(render);

render();
