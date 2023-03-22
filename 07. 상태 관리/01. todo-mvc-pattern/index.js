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

const events = {
  // 새로운 todo를 추가하는 함수
  addItem: (text) => {
    model.addItem(text);
    render(model.getState());
  },
  // 특정 todo의 텍스트를 변경하는 함수
  updateItem: (index, text) => {
    model.updateItem(index, text);
    render(model.getState());
  },
  // 특정 todo를 제거하는 함수
  deleteItem: (index) => {
    model.deleteItem(index);
    render(model.getState());
  },
  // 특정 todo의 완료 여부를 변경하는 함수
  toggleItemCompleted: (index) => {
    model.toggleItemCompleted(index);
    render(model.getState());
  },
  // 모든 todo를 완료 처리하는 함수
  completeAll: () => {
    model.completeAll();
    render(model.getState());
  },
  // 완료된 todo를 제거하는 함수
  clearCompleted: () => {
    model.clearCompleted();
    render(model.getState());
  },
  // 필터를 변경하는 함수
  changeFilter: (filter) => {
    model.changeFilter(filter);
    render(model.getState());
  },
};

const render = (state) => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector('#root');
    const newMain = registry.renderRoot(main, state, events);
    applyDiff(document.body, main, newMain);
  });
};

render(model.getState());
