// 해당 구성요소는 속성은 없지만,
// 내부 속성을 가짐
import { EVENTS } from './List.js';

export default class App extends HTMLElement {
  constructor() {
    super();
    this.state = {
      todos: [],
      filter: 'All',
    };

    this.template = document.getElementById('todo-app');
  }

  deleteItem(index) {
    this.state.todos.splice(index, 1);
    this.syncAttributes();
  }

  addItem(text) {
    this.state.todos.push({
      text,
      completed: false,
    });
    this.syncAttributes();
  }

  syncAttributes() {
    // 구성 요소 들의 속성을 업데이트 해버림
    // addItem이나, deleteItem을 통해서 상태가 업데이트 됨
    // filter를 변경하는 로직은 여기에 없음
    this.list.todos = this.state.todos;
    this.footer.todos = this.state.todos;
    this.footer.filter = this.state.filter;
  }

  connectedCallback() {
    window.requestAnimationFrame(() => {
      const content = this.template.content.firstElementChild.cloneNode(true);

      this.appendChild(content);

      // <input class="new-todo" />
      this.querySelector('.new-todo').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          // 엔터누르면 투두 아이템 추가
          this.addItem(e.target.value);
          e.target.value = '';
        }
      });

      // <todomvc-footer></todomvc-footer>
      this.footer = this.querySelector('todomvc-footer');

      // <todomvc-list></todomvc-list>
      this.list = this.querySelector('todomvc-list');
      // 하기 EVENTS.DELETE_ITEM 는 List 요소로 부터 올라오는 이벤트임!
      // 내부에서 관련 이벤트를 dispatch 함!
      this.list.addEventListener(EVENTS.DELETE_ITEM, (e) => {
        this.deleteItem(e.detail.index);
      });

      this.syncAttributes();
    });
  }
}
