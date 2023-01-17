// 예제 2-5
const getTodoElement = todo => {
    const {
      text,
      completed
    } = todo
  
    return `
    <li ${completed ? 'class="completed"' : ''}>
      <div class="view">
        <input 
          ${completed ? 'checked' : ''}
          class="toggle" 
          type="checkbox">
        <label>${text}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="${text}">
    </li>`
  }
  
  const getTodoCount = todos => {
    const notCompleted = todos
      .filter(todo => !todo.completed)
  
    const { length } = notCompleted
    if (length === 1) {
      return '1 Item left'
    }
  
    return `${length} Items left`
  }
  
  export default (targetElement, state) => {
    const {
      currentFilter,
      todos
    } = state
  
    // 1. 기본으로 사용되는 `target DOM요소`를 받음   
    // 2. 원래 노드를 복제하고 `state` 매개 변수 사용을 통해 업데이트   
    // 3. 새 노드 반환  
    const element = targetElement.cloneNode(true)
  
    const list = element.querySelector('.todo-list')
    const counter = element.querySelector('.todo-count')
    const filters = element.querySelector('.filters')
  
    list.innerHTML = todos.map(getTodoElement).join('')
    counter.textContent = getTodoCount(todos)
  
    Array
      .from(filters.querySelectorAll('li a'))
      .forEach(a => {
        if (a.textContent === currentFilter) {
          a.classList.add('selected')
        } else {
          a.classList.remove('selected')
        }
      })
  
    return element
  }