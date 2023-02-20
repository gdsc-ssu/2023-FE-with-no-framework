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

const model = modelFactory();

const { addChangeListener, ...events } = model;

const render = (state) => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector('#root');
    const newMain = registry.renderRoot(main, state, events);
    applyDiff(document.body, main, newMain);
  });
};

addChangeListener(render);
