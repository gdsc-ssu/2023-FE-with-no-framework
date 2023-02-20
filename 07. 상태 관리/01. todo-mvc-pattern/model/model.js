const cloneDeep = (x) => {
  return JSON.parse(JSON.stringify(x));
};

const INITAL_STATE = {
  todos: [],
  currentFilter: 'All',
};

export default (initialState = INITAL_STATE) => {
  const state = cloneDeep(initialState);

  const getState = () => {
    return Object.freeze(cloneDeep(state)); // 객체의 속성이 변경되거나 추가되는 것을 막는다.
  };

  const addItem = (text) => {
    if (!text) return;
    state.todos.push({
      text,
      completed: false,
    });
  };

  const updateItem = (index, text) => {
    if (!text) return;
    if (index < 0) return;
    if (!state.todos[index]) return;
    state.todos[index].text = text;
  };

  const deleteItem = (index) => {
    if (index < 0) return;
    if (!state.todos[index]) return;
    state.todos.splice(index, 1);
  };

  const toggleItemCompleted = (index) => {
    if (index < 0) return;
    if (!state.todos[index]) return;
    const { completed } = state.todos[index];
    state.todos[index].completed = !completed;
  };

  const completeAll = () => {
    state.todos.forEach((t) => (t.completed = true));
  };

  const clearCompleted = () => {
    state.todos = state.todos.filter((t) => !t.completed);
  };

  const changeFilter = (filter) => {
    state.currentFilter = filter;
  };

  return {
    addItem,
    updateItem,
    deleteItem,
    toggleItemCompleted,
    completeAll,
    clearCompleted,
    changeFilter,
    getState,
  };
};
