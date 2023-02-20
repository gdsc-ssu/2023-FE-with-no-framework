// Controller Code

import AppView from './view/app.js';
import CounterView from './view/counter.js';
import TodosView from './view/todos.js';
import FiltersView from './view/filters.js';

import applyDiff from './applyDiff.js';
import registry from './registry.js';
import modelFactory from './model/model.js';
import eventbusFactory from './model/eventBus.js';

registry.add('app', AppView);
registry.add('todos', TodosView);
registry.add('counter', CounterView);
registry.add('filters', FiltersView);

const model = modelFactory();
const eventBus = eventbusFactory(model);

const render = (state) => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector('#root');
    // 렌더링 함수에 이벤트 대신 이벤트 버스의 dispatch 메서드를 제공한다.
    const newMain = registry.renderRoot(main, state, eventBus.dispatch);
    applyDiff(document.body, main, newMain);
  });
};

eventBus.subscribe(render);

render(eventBus.getState());
