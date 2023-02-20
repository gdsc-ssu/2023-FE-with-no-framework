// Controller Code

import AppView from './view/app.js';
import CounterView from './view/counter.js';
import TodosView from './view/todos.js';
import FiltersView from './view/filters.js';

import registry from './registry.js';
import modelFactory from './model/model.js';
import applyDiff from './applyDiff.js';

registry.add('app', AppView);
registry.add('todos', TodosView);
registry.add('counter', CounterView);
registry.add('filters', FiltersView);

const loadState = () => {
  const serializedState = window.localStorage.getItem('state'); // inital state
  if (!serializedState) {
    return;
  }
  return JSON.parse(serializedState);
};

const model = modelFactory(loadState());

const { addChangeListener, ...events } = model;

const render = (state) => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector('#root');
    const newMain = registry.renderRoot(main, state, events);
    applyDiff(document.body, main, newMain);
  });
};

addChangeListener(render);

// 리스너 상태를 localStorage에 저장
addChangeListener((state) => {
  Promise.resolve.then(() => {
    window.localStorage.setItem('state', JSON.stringify(state));
  });
});

// logger
addChangeListener((state) => {
  console.log(`Current state (${new Date().getTime()})`, state);
});
