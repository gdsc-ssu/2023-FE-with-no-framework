import applyDiff from './applyDiff.js';

const DEFAULT_COLOR = 'black';

const createDomElement = (color) => {
  const div = document.createElement('div');
  div.textContent = 'Hello World!';
  div.style.color = color;
  return div;
};

export default class HelloWorld extends HTMLElement {
  static get observedAttributes() {
    return ['color'];
  }

  get color() {
    return this.getAttribute('color') || DEFAULT_COLOR;
  }

  set color(value) {
    this.setAttribute('color', value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // 해당 요소가 자식 노드를 가지고 있으면 반영X...?
    if (!this.hasChildNodes()) {
      return;
    }

    // 기존 노드와 차이점 분석 후,
    // 가상 돔을 통해 렌더링 진행
    applyDiff(this, this.firstElementChild, createDomElement(newValue));
  }

  connectedCallback() {
    window.requestAnimationFrame(() => {
      this.appendChild(createDomElement(this.color));
    });
  }
}
