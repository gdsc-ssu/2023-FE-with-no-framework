const TEMPLATE = '<ul class="todo-list"></ul>';

export const EVENTS = {
  DELETE_ITEM: 'DELETE_ITEM',
};

export default class List extends HTMLElement {
  constructor() {
    super();
  }
  // todos 요소 업데이트 되는지 파악하셈!
  static get observedAttributes() {
    return ['todos'];
  }

  get todos() {
    if (!this.hasAttribute('todos')) {
      return [];
    }

    return JSON.parse(this.getAttribute('todos'));
  }

  set todos(value) {
    this.setAttribute('todos', JSON.stringify(value));
  }

  // 삭제 이벤트 발생시
  // 이벤트를 발생 시킴으로,
  // 외부 환경에서 어떤 아이템이 클릭되었는지 파악하고,
  // 해당 아이템을 지워버림
  onDeleteClick(index) {
    const event = new CustomEvent(EVENTS.DELETE_ITEM, {
      detail: {
        index,
      },
    });

    this.dispatchEvent(event);
  }

  createNewTodoNode() {
    return this.itemTemplate.content.firstElementChild.cloneNode(true);
  }

  getTodoElement(todo, index) {
    const { text, completed } = todo;

    // 책의 내용 그대로 하면,
    // 여기서 에러 발생!
    // this 에러 때문임....
    // bind 하라는데 해도 안됨! ㅃ
    const element = this.createNewTodoNode();

    element.querySelector('input.edit').value = text;
    element.querySelector('label').textContent = text;

    if (completed) {
      element.classList.add('completed');
      element.querySelector('input.toggle').checked = true;
    }

    // data-index 요소 추가
    element.querySelector('button.destroy').dataset.index = index;

    return element;
  }

  updateList() {
    this.list.innerHTML = '';

    this.todos.map(this.getTodoElement).forEach((element) => {
      this.list.appendChild(element);
    });
  }

  connectedCallback() {
    this.innerHTML = TEMPLATE;
    this.itemTemplate = document.getElementById('todo-item');

    this.list = this.querySelector('ul');

    this.list.addEventListener('click', (e) => {
      if (e.target.matches('button.destroy')) {
        // dataset
        this.onDeleteClick(e.target.dataset.index);
      }
    });

    this.updateList();
  }

  attributeChangedCallback() {
    this.updateList();
  }
}
