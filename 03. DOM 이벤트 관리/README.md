# 3장. DOM 이벤트 관리

> 지금까지는 정적인 렌더링에 대해 알아보았다. 이제는 동적인 변화를 일으키는 `이벤트`에 대해 알아보자

## ✅ YAGNI 원칙

`익스트림 프로그래밍(XP)`의 원칙 중 하나

XP : 켄트 백이 고안, 애자일 스크럼의 방법론 중 하나. 목표는 고객이 원하는 양질의 SW를 빠른 시간안에 전달
정말 필요하다고 간주할 떄까지 기능을 추가하지 마라
특히 프레임워크없는 방식에서는 중요함

## DOM 이벤트 API

이벤트에 반응하려면 이벤트를 트리거한 DOM요소에 연결해야 함

### 속성에 핸들러 연결

on속성 이용 : onClick 등

```js
let button = document.querySelector("#property");
button.onclick = () => {
  console.log("Click managed using onclick property");
};
```

`한 번에 한 핸들러만 연결`할 수 있기 때문에 좋지 않은 방법

### addEventListener로 핸들러 연결

한 이벤트에 여러 핸들러 등록 가능

removeEventListener로 제거 가능

```js
div.addEventListener(
  "click",
  () => {
    console.log("Div Clicked");
  },
  false
);

button.addEventListener(
  "click",
  (e) => {
    console.log("Button Clicked");
  },
  false
);
```

### 이벤트 객체

웹에 전달된 `모든 이벤트에는 Event 인터페이스를 구현`

또한 Click 이벤트는 MouseEvent 인터페이스를 구현하는 등 하위 인터페이스를 추가로 구현하기도 한다.

### DOM 이벤트 라이프 사이클

```js
// addEventListener의 세 번째 매개변수는 useCapture로 기본값은 false.
// true면 캡쳐링 단계에서, false면 버블링 단계에서 이벤트 캐치
addEventListener(type, listener);
addEventListener(type, listener, options);
addEventListener(type, listener, useCapture);
```

Event 인터페이스의 `stopPropagation` 메서드로 버블 체인을 중지시킬 수 있음
→ 복잡한 구조에서 안전하게 이벤트 제어 가능

```js
div.addEventListener(
  "click",
  () => {
    console.log("Div Clicked");
  },
  false
);

button.addEventListener(
  "click",
  (e) => {
    // 이를 통해 부모 태그인 div로 버블링을 발생시키지 않음
    e.stopPropagation();
    console.log("Button Clicked");
  },
  false
);
```

하향식으로 이벤트를 캐치하고 싶다면 캡쳐링 단계를 이용하면 될 것임

1. 캡쳐 단계
2. 목표 단계 : 이벤트가 목표 요소에 도달
3. 버블 단계

### 사용자 정의 이벤트 사용

이벤트를 커스텀 가능

```js
const event = new CustomEvent(EVENT_NAME, {
  detail: { time },
});

div.dispatchEvent(event); // 꼭 이 메서드를 실행시켜야 커스텀 이벤트 실행
```

## TodoMVC에 이벤트 추가

### 템플릿 요소

document.createElement API로 생성 가능

하지만 복잡하고 코드가 명료하지 않음

이 때 `HTML의 template 태그`를 사용 가능

스크립트에 의해 DOM으로 옮겨져야만 작동 → template으로 선언해 놓고, 스크립트로 상태에 따라 넣어주는 것임

```html
<template id="todo-app">
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" placeholder="What needs to be done?" autofocus />
    </header>
    <section class="main">
      <input id="toggle-all" class="toggle-all" type="checkbox" />
      <label for="toggle-all"> Mark all as complete </label>
      <ul class="todo-list" data-component="todos"></ul>
    </section>
    <footer class="footer">
      <span class="todo-count" data-component="counter"> </span>
      <ul class="filters" data-component="filters">
        <li>
          <a href="#/">All</a>
        </li>
        <li>
          <a href="#/active">Active</a>
        </li>
        <li>
          <a href="#/completed">Completed</a>
        </li>
      </ul>
      <button class="clear-completed">Clear completed</button>
    </footer>
  </section>
</template>
```

이를 이용하여 app.js라는 구성 요소를 만들 수 있음 → 태그 형식이 좀 더 직관적이긴 한 듯

이로써 렌더링 엔진은 이제 문자열이 아닌 tag로 동작

```js
let template;

const createAppElement = () => {
  if (!template) template = document.getElementById("todo-app");

  return template.content.firstElementChild.cloneNode(true);
};

export default (targetElement) => {
  const newApp = targetElement.cloneNode(true);
  newApp.innerHTML = "";
  newApp.appendChild(createAppElement());
  return newApp;
};
```

### 기본 이벤트 처리 아키텍쳐

이렇게 처리된 아키텍쳐에 이벤트를 넣기가 쉬워짐

이벤트를 넣으면서 상태-렌더링-이벤트 형태의 loop가 형성됨

```js
const events = {
  // 이벤트가 일어날 때마다 리렌더링
  deleteItem: (index) => {
    state.todos.splice(index, 1);
    render();
  },
  addItem: (text) => {
    state.todos.push({ text, completed: false });
    render();
  },
};

const render = () => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector("#root");
    const newMain = registry.renderRoot(main, state, events);
    applyDiff(document.body, main, newMain);
  });
};
```

실제 애플리케이션에서는 이벤트도 이벤트 레지스트리로 관리해주는 것이 좋음
→ 쉽게 레지스트리에 이벤트를 등록하고, 한 곳에서 조회하여 관리할 수 있으므로
→ 일일이 수동으로 호출할 필요가 없음

## 이벤트 위임

각 리스트마다 이벤트 핸들러를 하나 씩 등록하는 것이 아니라, 리스트 전체에 하나의 이벤트 핸들러를 등록하여 사용 가능

하지만 이런 최적화 작업도 YAGNI에 따라 작업할 것
