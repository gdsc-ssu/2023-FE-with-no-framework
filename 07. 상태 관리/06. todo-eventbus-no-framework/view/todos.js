import eventCreators from '../model/eventCreators.js';

let template;

// 템플릿을 사용해서 todo 아이템 생성
const createNewTodoNode = () => {
  if (!template) {
    template = document.getElementById('todo-item');
  }

  return template.content.firstElementChild.cloneNode(true);
};

// todo에 이벤트 부착
const attachEventsToTodoElement = (element, index, dispatch) => {
  const deleteHandler = (e) =>
    dispatch(eventCreators.deleteItem(parseInt(index)));
  const toggleHandler = (e) =>
    dispatch(eventCreators.toggleItemCompleted(index));
  const updateHandler = (e) => {
    if (e.key === 'Enter') {
      element.classList.remove('editing');
      dispatch(eventCreators.updateItem(index, e.target.value));
    }
  };

  element
    .querySelector('button.destroy')
    .addEventListener('click', deleteHandler);

  element
    .querySelector('input.toggle')
    .addEventListener('click', toggleHandler);

  element.addEventListener('dblclick', () => {
    element.classList.add('editing');
    element.querySelector('input.edit').focus();
  });

  element
    .querySelector('input.edit')
    .addEventListener('keypress', updateHandler);
};

// todo 아이템 생성
const getTodoElement = (todo, index, dispatch) => {
  const { text, completed } = todo;
  const element = createNewTodoNode();

  element.querySelector('input.edit').value = text;
  element.querySelector('label').textContent = text;

  if (completed) {
    element.querySelector('input.toggle').checked = true;
    element.classList.add('completed');
  }
  attachEventsToTodoElement(element, index, dispatch);
  return element;
};

const filterTodos = (todos, filter) => {
  const isCompleted = (todos) => todos.completed;
  if (filter === 'Active') {
    return todos.filter((t) => !isCompleted(t));
  }
  if (filter === 'Completed') {
    return todos.filter(isCompleted);
  }
  return [...todos];
};

// render todolist
export default (targetElement, state, events) => {
  const { todos, currentFilter } = state;
  const newTodoList = targetElement.cloneNode(true);
  newTodoList.innerHTML = '';

  const filteredTodos = filterTodos(todos, currentFilter);

  filteredTodos.map((todo, index) => {
    const newElement = getTodoElement(todo, index, events);
    newTodoList.appendChild(newElement);
  });

  return newTodoList;
};
