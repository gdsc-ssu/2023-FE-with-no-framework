let template;

// 템플릿을 사용해서 todo 아이템 생성
const createNewTodoNode = () => {
  if (!template) {
    template = document.getElementById('todo-item');
  }

  return template.content.firstElementChild.cloneNode(true);
};

// todo에 이벤트 부착
const attachEventsToTodoElement = (element, index, events) => {
  const handler = (e) => events.deleteItem(index);

  element.querySelector('button.destroy').addEventListener('click', handler);

  element
    .querySelector('input.toggle')
    .addEventListener('click', (e) => events.toggleItemCompleted(index));

  element.addEventListener('dblclick', () => {
    element.classList.add('editing');
    element.querySelector('input.edit').focus();
  });

  element.querySelector('input.edit').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      element.classList.remove('editing');
      events.updateItem(index, e.target.value);
    }
  });
};

// todo 아이템 생성
const getTodoElement = (todo, index, events) => {
  const { text, completed } = todo;
  const element = createNewTodoNode();

  element.querySelector('input.edit').value = text;
  element.querySelector('label').textContent = text;

  if (completed) {
    element.querySelector('input.toggle').checked = true;
    element.classList.add('completed');
  }
  attachEventsToTodoElement(element, index, events);
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
