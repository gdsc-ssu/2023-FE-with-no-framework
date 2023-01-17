import getTodos from './getTodos.js'
import todosView from './view/todos.js'
import counterView from './view/counter.js'
import filtersView from './view/filters.js'
import applyDiff from './applyDiff.js'

import registry from './registry.js'

registry.add('todos', todosView)
registry.add('counter', counterView)
registry.add('filters', filtersView)

const state = {
  todos: getTodos(),
  currentFilter: 'All'
}

// 2-18) diff 알고리즘을 사용하는 메인 컨트롤러
const render = () => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector('.todoapp')
    const newMain = registry.renderRoot(main, state)
    // applyDiff(현재 DOM 노드, 실제 DOM 노드, 새로운 가상 DOM 노드의 부모)
    applyDiff(document.body, main, newMain)
  })
}

// 2-17) 5초마다 임의의 데이터 렌더링
window.setInterval(() => {
  state.todos = getTodos()
  render()
}, 1000)

render()
