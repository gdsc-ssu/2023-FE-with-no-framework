import eventCreators from '../model/eventCreators.js';

let template;

const getTemplate = () => {
  if (!template) {
    template = document.getElementById('todo-app');
  }
  return template.content.firstElementChild.cloneNode(true);
};

const addEvents = (targetElement, dispatch) => {
  targetElement.querySelector('.new-todo').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const event = eventCreators.addItem(e.target.value); // event 객체를 생성
      dispatch(event); // 이벤트 객체를 전파
      e.target.value = '';
    }
  });

  targetElement
    .querySelector('input.toggle-all')
    .addEventListener('click', (e) => {
      dispatch(eventCreators.completeAll());
    });

  targetElement
    .querySelector('.clear-completed')
    .addEventListener('click', (e) => {
      dispatch(eventCreators.clearCompleted());
    });
};

export default (targetElement, state, dispatch) => {
  const newApp = targetElement.cloneNode(true);
  newApp.innerHTML = '';
  newApp.appendChild(getTemplate());

  addEvents(newApp, dispatch);
  return newApp;
};
