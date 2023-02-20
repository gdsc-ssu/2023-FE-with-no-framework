import todosModifiers from './todos.js';
import filterModifers from './filter.js';

const cloneDeep = (x) => {
  return JSON.parse(JSON.stringify(x));
};

const INITAL_STATE = {
  todos: [],
  currentFilter: 'All',
};

export default (initialState = INITAL_STATE) => {
  return (prevState, event) => {
    if (!event) {
      return cloneDeep(initialState);
    }

    const { todos, currentFilter } = prevState;

    const newTodos = todosModifiers(todos, event);
    const newCurrentFilter = filterModifers(currentFilter, event);

    if (newTodos === todos && newCurrentFilter === currentFilter) {
      return prevState;
    }

    return {
      todos: newTodos,
      currentFilter: newCurrentFilter,
    };
  };
};
