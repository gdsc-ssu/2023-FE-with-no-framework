# 2장. 렌더링
모든 웹 애플리케이션에서 가장 중요한 기능 중 하나 : **데이터의 표시**     
- 데이터 표시 : 요소를 화면 또는 다른 출력장치에 **렌더링 하는 것**을 의미
- W3C : 프로그래밍 방식으로 요소를 렌더링하는 방식을 **문서 객체 모델, DOM**으로 정의

## ✅ 문서 객체 모델 (DOM, Document Object Model)
- **DOM** : 웹 애플리케이션을 구성하는 요소를 조작할 수 있는 API
- 모든 HTML 페이지 : **트리**로 구성

```html
<!-- 2-1) 간단한 HTML 테이블 -->
<html>
    <body>
        <table>
            <tr>
                <th>Framework</th>
                <th>Github stars</th>
            </tr>
            <tr>
                <th>Vue</th>
                <th>118917</th>
            </tr>
            <tr>
                <th>React</th>
                <th>115392</th>
            </tr>
        </table>
    </body>
</html>
- 테이블의 DOM 표현
```
<img src="https://user-images.githubusercontent.com/66112716/210324973-27ce8fcd-fad6-4cfc-85d6-97495479dd1f.png" width="700" />

DOM : HTML 요소로 정의된 트리를 관리하는 방법    

```js
// 2-2) React 셀의 색상 변경
const SELECTOR = 'tr:nth-child(3) > td'
const cell = document.querySelector(SELECTOR)
cell.style.background = 'red'
```
> `querySelector` : Node 메서드    
> `Node` : HTML 트리에서 노드를 나타내는 기본 인터페이스    

[Node의 Method 참고 자료](https://developer.mozilla.org/ko/docs/Web/API/Node)

## ✅ 렌더링 성능 모니터링
웹 용 렌더링 엔진 설계 시 **가독성**, **유지 관리성**을 염두에 두어야 함     
- 렌더링 엔진에서 또 다른 중요한 요소 : **성능**    

### ▶️ 크롬 개발자 도구
- FPS(Frames Per Second) : 렌더링 성능 모니터링에서 사용할 수 있는 기능 중 하나로 초당 프레임 수 추적 가능

<img width="594" alt="" src="https://user-images.githubusercontent.com/66112716/210329135-bbe5e7fc-4103-41e4-9964-718f5b54f65a.png">

- 크롬 개발자 도구 → `cmd/ctrl` + `Shift` + `P` : FPS 및 GPU 사용량 확인 가능

### ▶️ state.js
- 애플리케이션의 FPS를 모니터링할 수 있는 라이브러리 `state.js` 사용
    - 프레임 & 할당된 메가바이트의 메모리 렌더링에 필요한 밀리초 표시 가능
    - 어떤 웹 애플리케이션에도 쉽게 포함 가능
    - [state.js Github](https://github.com/mrdoob/stats.js/) README : 위젯 연결 가능한 bookmarklet 설명

### ▶️ 사용자 정의 성능 위젯
- FPS를 보여주는 위젯 작성은 간단함
    1. `requestAnimationFrame 콜백`을 사용해 현재 렌더링 사이클과 다음 사이클 사이의 시간 추적     
    2. 콜백이 1초 내에 호출되는 횟수를 추적    

- 사용자 정의 성능 모니터 위젯
    - FPS 계산 후 위젯에 숫자를 표시하거나 콘솔을 사용해 데이터를 출력할 수 있음
```js
// 2-3) 사용자 정의 성능 모니터 위젯
let panel
let start
let frames = 0

const create = () => { 
    const div = document.createElement('div') 

        div.style.position = 'fixed'
        div.style.left = '0px' 
        div.style.top = '0px' 
        div.style.width = '50px' 
        div.style.height = '50px' 
        div.style.backgroundColor = 'black'
        div.style.color = 'white'
        
        return div 
}

    const tick=() => { 
        frames++
        const now = window.performance.now() 
        if (now >= start + 1000) {
            panel.innerText = frames 
            frames = 0
            start = now
        }
        window.requestAnimationFrame(tick)
    }

    const init = (parent = document.body) =>{ 
        panel = create()
        window.requestAnimationFrame (() => { 
            start = window.performance.now() 
            parent.appendChild(panel)
            tick()
        }) 
    }

export default { 
    init
}
```

## ✅ 렌더링 함수
순수 함수로 요소를 렌더링함 == **DOM 요소가 애플리케이션의 상태에만 의존**한다는 것을 의미     

- 순수 함수 렌더링의 수학적 표현 : 
$view = f(state)$     
- 순수 함수 사용 시 : 테스트 가능성, 구성 가능성의 장점 존재
    - 몇가지 문제점 역시 존재하며, 뒷부분에서 다루도록 함

### ▶️ TodoMVC
- [TodoMVC](http://todomvc.com) : 다양한 프레임워크로 작성된 동일한 할일 리스트의 구현을 모아놓은 프로젝트
- [TodoMVC live demo](http://todomvc.com/examples/react/#/)
    - `TodoMVC`에서의 렌더링
        - 항목과 툴바의 렌더링
        - 이후, HTTP 요청, 이밴트 처리 등의 요소 추가

### ▶️ 순수 함수 렌더링
- [2-4) 기본 TodoMVC 앱 구조](https://github.com/Apress/frameworkless-front-end-development/tree/master/Chapter02/01)
    - 위 코드의 동적인 구성하기 위한 요소
        - 필터링된 `todo 리스트`를 가진 UI
        - 완료되지 않은 `todo 수`를 가진 `span`
        - `selected 클래스`를 오른쪽에 추가한 필터 유형을 가진 `링크`

- [2-5) TodoMVC 렌더링 함수의 첫 번째 버전](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter02/01/view.js)
    - 예제 2-5) `view.js`의 분석
        1. 기본으로 사용되는 `target DOM요소`를 받음   
        2. 원래 노드를 복제하고 `state` 매개 변수 사용을 통해 업데이트   
        3. 새 노드 반환  
        - 본 코드에서의 DOM 수정은 virtual이며, _분리된 요소_ 로 작업하고 있음   
            → 분리된 요소 생성을 위해 `cloneNode`메소드로 기존 노드 복제   
            → 새로 생성된 DOM 요소는 실제 DOM 요소   
        - `예제 2-5` 리스트에서는 DOM의 실제 수정 사항이 커밋되지 않은 상태   
            - 분리된 DOM요소의 수정이 이루어질 경우 성능 향상   
            → `예제 2-6`에서의 컨트롤러 사용을 통해 본 view 함수를 실제 DOM에 연결   

```js
// 2-6) 기본 컨트롤러
import getTodos from './getTodos.js'
import view from './view.js'

const state = {
    todos: getTodos(),
    currentfilter: All
}

const main = document.querySelector('.todoapp')

window.requestAnimationFrame(() => {
    const newMain = view(main, state)
    main.replaceWith(newMain) 
})
```
간단한 **렌더링 엔진**은 [requestAnimationFrame](https://developer.mozilla.org/en-us/docs/Web/APl/window/requestAnimationframe)을 기반으로 함     
- 모든 DOM 조작 및 애니메이션은 이 DOM API를 기반으로 해야 함
    - 메인 스레드 차단 X
    - 다음 다시 그리기(repaint)가 이벤트 루프에서 스케줄링 되기 직전에 실행됨

- 정적 렌더링 스키마

![](https://user-images.githubusercontent.com/66112716/210338957-c408923e-9e46-41a9-8fbd-f52382f18007.png)

### ▶️ 코드 리뷰
예제 2-6에서의 렌더링 방식은 `requestAnimationFrame`과 가상 노드 조작 사용을 통해 충분한 성능 보장    
뷰 함수의 낮은 가독성    

- 예제 2-6의 문제점
    - **하나의 거대한 함수**
        - 여러 DOM 요소를 조작하는 함수가 단 하나뿐 → 로직을 복잡하게 만들기 쉬움
    - **동일한 작업을 수행하는 여러 방법**
        - 문자열을 통해 리스트 항목 생성
        - `todo count` 요소 : 기존 요소에 테스트를 추가하면 해결
        - 필터 : `classList` 관리

**[새롭게 작성된 애플리케이션 버전 예제 코드](https://github.com/Apress/frameworkless-front-end-development/tree/master/Chapter02/02)**    

### ▶️ 구성 요소 함수
[예제 2-7](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter02/02/view/app.js)를 통해 올바른 함수를 수동으로 호출해야 함을 알 수 있음    
구성 요소 기반의 애플리케이션 작성 → 구성 요소 간 상호작용에 **선언적 방식** 사용해야 함    

- [chapter02/03](https://github.com/Apress/frameworkless-front-end-development/tree/master/Chapter02/03) : 구성 요소 레지스트리를 가지는 렌더링 엔진의 예    
    → 구성 요소 레지스트리를 가지는 렌더링 엔진을 만들기 위해   
    특정 사례에서 사용할 구성 요소를 선언하는 방법의 정의 필요    

- [2-11) 구성 요소를 사용하고자 데이터 속성을 사용하는 앱](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter02/03/index.html)) 
    - [데이터 속성(data attributes)](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) 사용으로 어떤 구성 요소를 사용하는지 결정하는 방법 확인 가능   
    - 구성요소의 name을 `data-component` 속성에 넣음으로써 **뷰 함수의 필수 호출 대체**

```js
// 2-12) 간단한 구성 요소 레지스트리
// 일반 JS 객체로 레지스트리 구현
const registry = {
    'todos' : todosView,
    'counter' : counterView,
    'filters' : filtersView
}
```
- `레지스트리` : 애플리케이션에서 사용할 수 있는 모든 구성요소의 인덱스
- `레지스트리의 key` : `data-component` 속성 값과 일치 → 구성 요소 기반 렌더링 엔진의 핵심 메커니즘
    - 본 메커니즘 : 루트 컨테이너(view 함수) + 생성할 모든 구성 요소에 적용되어야 함    
        → 모든 구성요소가 다른 구성 요소 내에서도 사용 가능   
        → **재사용성** : 구성 요소 기반 애플리케이션에서 필수적 요소   
    - [렌더링 엔진 동작 원리](https://all-young.tistory.com/22)

> 위 작업(루트 컨테이너 + 생성할 모든 구성 요소에 메커니즘 적용)을 위해 모든 구성 요소가 `data-component`속성의 값을 읽고,   
> 올바른 함수를 자동으로 호출하는 기본 구성 요소에서 상속되어야 함   

→ 순수 함수로 작성하고 있으므로 **이 기본 객체에서 상속받을 수 없음**   
    → sol. 구성요소를 래핑하는 고차 함수 생성

- [2-13) 고차 함수 렌더링](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter02/04/registry.js)
    - `renderWrapper` 함수
        - 원래 구성 요소를 가져와 동일한 이름의 새로운 구성요소를 반환
        - 레지스트리에서 `data-component` 속성을 가지는 모든 DOM 요소 찾음
        - 요소 발견 시 자식 구성 요소를 호출 but, **자식 구성 요소는 동일한 함수로 래핑**   
            → 재귀함수와 같이 마지막 구성 요소까지 쉽게 탐색 가능   

- 구성 요소 추가를 위해 이전 함수로 구성 요소를 래핑하는 함수 필요
```js
// 2-14) 레지스트리 접근자(Accessor) 메소드
const add = (name, component) => {
    registry[name] = renderWrapper(component)
}
```

- 애플리케이션의 루트를 렌더링하는 메소드 제공 필요(최초 DOM 요소에서 렌더링을 시작하기 위해)
```js
// 2-15) 구성 요소 기반 애플리케이션의 부팅 함수
const renderRoot = (root, state) => {
    const cloneComponent = root => {
        return root.cloneNode(true)
    }
    return renderWrapper(cloneComponent)(root, state)
}
```

- [2-16) 구성 요소 레지스트리를 사용하는 컨트롤러](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter02/05/index.js)
    - `add`, `renderRoot` : 구성 요소의 공용 인터페이스

- 구성 요소 레지스트리 스키마
<img src="https://user-images.githubusercontent.com/66112716/212845873-6c039f44-a8ff-47d5-a019-34dfe26c9603.png" width="700" />


🎉 **프레임워크 없이 구성 요소 기반 애플리케이션 구현 완료!**   

## ✅ 동적 데이터 렌더링
이전 [ver.04](https://github.com/Apress/frameworkless-front-end-development/tree/master/Chapter02/04)에서는 정적 데이터 사용   
→ 실제 애플리케이션 : 사용자 or 시스템의 이벤트에 의해 데이터 변경이 이루어짐   

```js
// 2-17) 5초마다 임의의 데이터 렌더링
const render = () => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector('.todoapp')
    const newMain = registry.renderRoot(main, state)
    applyDiff(document.body, main, newMain)
  })
}

window.setInterval(() => {
  state.todos = getTodos()
  render()
}, 1000)

render()
```
1. 새 데이터가 있을 때마다 가상 루트 요소를 만듦   
2. 실제 요소를 새로 생성된 요소로 바꿈   
    → 소규모 애플리케이션 : 충분한 성능, 대규모 프로젝트 : 성능 저하 가능

### ▶️ 가상 DOM
`virtual DOM` : 선언적 렌더링 엔진의 성능을 개선시키는 방법   
- UI 표현은 메모리에 유지 & 실제 DOM과 동기화   
    → 실제 DOM : 가능한 한 적은 작업 수행 : **조정**(reconciliation)   
- [virtual DOM이란?](https://velopert.com/3236)   

하기 리스트를 실제 DOM 요소라 가정   
```html
<ul>
    <li>First Item</li>
</ul>
```
아래와 같이 새로운 리스트로 변경하려면?  
```html
<ul>
    <li>First Item</li>
    <li>Second Item</li>
</ul>
```
- 가상 DOM 사용을 통해 시스템이 **추가된 마지막 `li`가 실제 DOM에 필요한 유일한 작업**임을 **동적으로 이해**   
    → 가상 DOM의 핵심 : `diff Algorithm`   
    - 실제DOM을 문서에서 분리된 새로운 DOM 요소의 사본으로 바꾸는 가장 빠른 방법 발견     

<img src="https://user-images.githubusercontent.com/66112716/212852347-6aac6f35-2667-488e-b6ee-fac4e56c9998.png" width="600" />

```js
// 2-18) diff 알고리즘을 사용하는 메인 컨트롤러
const render = () => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector('.todoapp')
    const newMain = registry.renderRoot(main, state)
    // applyDiff(현재 DOM 노드, 실제 DOM 노드, 새로운 가상 DOM 노드의 부모)
    applyDiff(document.body, main, newMain)
  })
}
```

- **`applyDiff` 함수 분석**
1. 새 노드가 정의되지 않은 경우 실제 노드 삭제   
```js
if (readNode && !virtualNode) {
    realNode.remove()
}
```

2. 실제 노드가 정의되지 않았지만 가상 노드가 존재하는 경우, 부모 노드에 추가   
```js
if (!readNode && virtualNode) {
    parentNode.appendChild(virtualNode)
}
```

3. 두 노드가 모두 정의된 경우, 두 노드 간 차이 확인   
```js
if (isNodeChanged(virtualNode, realNode)) {
    realNode.replaceWith(virtualNode)
}
```

- [2-19) applyDiff 함수, 2-20) isNodeChanged 함수](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter02/05/applyDiff.js)
- diff 알고리즘 구현 : 노드를 다른 노드와 비교해 노드의 변경 여부 확인
    - 속성 수가 다르다.
    - 하나 이상의 속성이 변경됐다.
    - 노드에는 자식이 없으며, textContent가 다르다.

개선된 검사 수행으로 성능 향상은 가능하나, **렌더링 엔진을 최대한 간단하게 유지**하는 것을 권장   
> 도널드 크누스 : 시기상조의 최적화는 모든(또는 적어도 대부분의) 악의 근원이다.  