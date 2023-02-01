// 예제 2-6
import getTodos from './getTodos.js'
import view from './view.js'

const state = {
  todos: getTodos(),
  currentFilter: 'All'
}

const main = document.querySelector('.todoapp')

// 렌더링 엔진
window.requestAnimationFrame(() => {
  const newMain = view(main, state)
  main.replaceWith(newMain)
})