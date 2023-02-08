# 6장. 라우팅

## 1. 개념

### 1.1. SPA (Single Page Application)

: 하나의 HTML 페이지로 실행되는 웹 애플리케이션

- 사용자가 다른 뷰로 이동할 때 애플리케이션은 뷰를 **동적으로** 다시 그려 표준 웹 탐색 효과를 제공한다.
- 페이지 간 탐색 시 사용자가 경험할 수 있는 지연을 제거해 일반적으로 더 나은 사용자 경험을 제공한다.

<br>

→ 이러한 종류의 애플리케이션은 서버와의 상호작용을 위해 **AJAX**를 사용한다. 
(하지만 모든 AJAX 애플리케이션이 SPA일 필요는 없다.)

<img src="https://user-images.githubusercontent.com/70627979/217498414-13bf5432-e75f-4d9e-be9f-7610075d5a61.png" alt="image" style="zoom:25%;" />

<br>

### 1.2. 라우팅 시스템

대부분의 프레임워크는 라우팅 시스템을 통해 경로를 정의할 수 있는 시스템을 기본적으로 제공한다.

<br>

아키텍처 관점에서 모든 **라우팅 시스템은 두 가지 핵심 요소**를 가진다.

- 애플리케이션의 경로 목록을 수집하는 **레지스트리**
  - 가장 간단한 형태의 경로는 URL을 DOM 구성 요소에 매칭
- 현재 URL의 **리스너**
  - URL이 변경되면 라우터는 현재 URL과 일치하는 경로에 바인딩된 구성 요소로 교체

<br>

## 2. 라우팅 시스템 구현

라우팅 시스템을 세 가지 버전으로 작성

1. **프레그먼트 식별자(Fragment Identifiers)**를 기반으로 구현
2. **히스토리 API(History API)**를 기반으로 구현
3. **Navigo 라이브러리**를 기반으로 구현

<br>

### 2.1. 프래그먼트 식별자

모든 URL은 [프래그먼트 식별자](https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web)라고 불리는 **해시(#)**로 시작하는 선택적 부분을 포함할 수 있다.

- 프래그먼트 식별자의 목적은 **웹 페이지의 특정 섹션을 식별**하는 것이다.
- 브라우저는 URL을 탐색할 때, 프래그먼트로 식별된 요소가 **뷰포트(viewport)의 맨 위에 오도록 페이지를 스크롤**한다.

<br>

리스트 6-4) 기본 라우터 구성 ([원본 코드](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter06/00/index.js))

```javascript
// index.js
import createRouter from './router.js'
import createPages from './pages.js'

const container = document.querySelector('main')

const pages = createPages(container)

const router = createRouter()

router
  .addRoute('#/', pages.home)
  .addRoute('#/list', pages.list)
  .setNotFound(pages.notFound)
  .start()
```

<br>

- [createPages 구현](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter06/00/pages.js)
  - URL이 변경될 때 메인 컨테이너 내부에 현재 구성 요소를 넣는다.
- [**createRouter 구현**](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter06/00/router.js)
  - **라우터의 세 가지 공개 메서드**
    - `addRoute()` : 새 라우터와 프래그먼트로 구성된 구성 요소 정의
    - `setNotFound()` : 레지스트리에 없는 모든 프래그먼트에 대한 제네릭 구성 요소 설정
    - `start()` : 라우터 초기화 및 URL 변경 청취
  - 현재 프래그먼트 식별자는 `location` 객체의 `hash` 속성에 저장된다. (`window.location.hash`)
  - 현재 프래그먼트가 변경될 때마다 알림을 받는데 사용할 수 있는 [`hashchange` 이벤트](https://developer.mozilla.org/ko/docs/Web/API/Window/hashchange_event)도 있다.
  - **`checkRoutes` 메서드**
    1. 현재 프래그먼트와 일치하는 경로를 찾는다.
    2. 경로가 발견되면 해당 구성 요소 함수가 메인 컨테이너에 있는 콘텐츠를 대체한다.

<img src="https://user-images.githubusercontent.com/70627979/217498457-bd906562-7ff3-460a-9d42-3ce6e03f3759.png" alt="image" style="zoom: 30%;" />

<br>

#### 2.1.1. 프로그래밍 방식으로 탐색

위에서는 앵커(`a` tag)를 클릭하는 방식으로 탐색이 활성화 되었는데, 때로는 **프로그래밍 방식으로 뷰의 변경**이 필요한 경우도 있다. (예를 들어, 로그인에 성공한 사용자를 개인 페이지로 리디렉션하는 경우)

리스트 6-6,7,8) 버튼에 데이터 속성 및 탐색 추가, 프로그래밍 방식으로  탐색 
([index.html 코드](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter06/00.1/index.html), [index.js 코드](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter06/00.1/index.js), [router.js 코드](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter06/00.1/router.js))

```javascript
// index.html (데이터 속성 추가)
<button data-navigate="/">Go To Index</button>
<button data-navigate="/list">Go To List</button>
<button data-navigate="/list/1">Go To Detail With Id 1</button>

// index.js (이벤트 핸들러 추가)
const NAV_BTN_SELECTOR = 'button[data-navigate]'

document.body.addEventListener('click', e => {
    const { target } = e
    if (target.matches(NAV_BTN_SELECTOR)) {
      const { navigate } = target.dataset
      router.navigate(navigate)
    }
  })

// router.js (프로그래밍 방식으로 탐색)
router.navigate = fragment => {
	window.location.hash = fragment
}
```

<br>

#### 2.1.2. 경로 매개변수

마지막으로 라우터에 **경로 매개변수 읽기 기능**을 추가한다.

경로 매개변수는 **도메인 변수와 관련된 URL의 일부**다. 예를 들어 http://localhost:8080#/order/1 에서 order 도메인 모델의 ID를 얻을 수 있으며, 일반적으로 http://localhost:8080#/order/:id 와 같이 URL에 매개변수가 포함돼 있음을 나타낸다.

<br>

리스트 6-10) 매개변수로 경로 정의 ([원본 코드](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter06/00.2/index.js))

```tsx
// index.js 
...
router
  .addRoute('#/', pages.home)
  .addRoute('#/list', pages.list)
  .addRoute('#/list/:id', pages.detail)
  .addRoute('#/list/:id/:anotherId', pages.anotherDetail)
  .setNotFound(pages.notFound)
  .start()
```

<br>

경로 매개변수 관리를 위해 라우터 구현을 **정규표현식 기반**으로 변경해야 한다. ([리스트 6-11 코드](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter06/00.2/router.js))

- 현재 프래그먼트가 레지스트리의 경로 중 하나와 매칭되는지 확인 후, 동일한 정규식을 이용해 구성 요소 함수의 인수로 사용될 매개변수를 추출

<br>

### 2.2. 히스토리 API

라우터 시스템의 두 번째 구현은 [History API](https://developer.mozilla.org/ko/docs/Web/API/History_API)를 사용한다.

- 히스토리 API를 통해 개발자는 사용자 탐색 히스토리를 조작할 수 있다.
- 히스토리 API를 사용하는 경우 **프래그먼트 식별자를 기반으로 경로를 지정할 필요가 없다.**
  - http://localhost:8080/list/1/2 같은 **실제 URL**을 활용한다. (`window.location.pathname`)
- URL이 변경될 때 알림을 받을 수 있는 DOM 이벤트가 없다.
  - 임의로 `setInterval`을 사용해 경로 이름이 변경되었는지 정기적으로 확인

<br>

리스트 6-14) 히스토리 API로 작성된 라우터 ([원본 코드](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter06/01/router.js))

```javascript
// router.js
const checkRoutes = () => {
	const { pathname } = window.location // window.location.pathname
	//  ...
}

// history API의 pushState 메서드를 이용한 새 URL 이동 구현
router.navigate = path => {
	window.history.pushState(null, null, path)
}

router.start = () => {
	checkRoutes()
	window.setInterval(checkRoutes, TICKTIME) // 문제점
}
```

<br>

#### 2.2.1. 링크 사용

히스토리 API로 완전히 전환하기 위해서는 **템플릿에 있는 링크를 업데이트** 해야한다.

<br>

리스트 6-16) 히스토리 API 링크 탐색

```tsx
// index.html
<a href="/">Go To Index</a>
<a href="/list">Go To List</a>
<a href="/list/1">Go To Detail With Id 1</a>
```

하지만 이 링크는 기대한 바대로 동작하지 않는다. Go To List 링크를 클릭하면 `/list/index.html`로 이동하여 404 HTTP 오류가 발생한다.

<br>

이 링크가 동작하게 하려면 **디폴트 동작을 변경**해야 한다. 우선 내부 탐색에 사용되는 모든 링크를 표시하고, `Event` 객체의 `preventDefault` 메서드를 사용하여 모든 DOM 요소의 표준 핸들러를 비활성화 한다.

<br>

리스트 6-17,18) 히스토리 API 탐색 표시 링크, 내부 탐색 링크의 동작 변경 
([index.html 코드](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter06/01.1/index.html), [router.js 코드](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter06/01.1/router.js))

```javascript
// index.html
<a data-navigation href="/">Go To Index</a>
<a data-navigation href="/list">Go To List</a>
<a data-navigation href="/list/1">Go To Detail With Id 1</a>

// router.js
router.start = () => {
	checkRoutes()
  window.setInterval(checkRoutes, TICKTIME)

  document.body.addEventListener('click', e => {
			if (e.target.matches(NAV_A_SELECTOR)) {
				e.preventDefault()
				router.navigate(e.target.href)
			}
		})

    return router
  }
```

<br>

### 2.3. Navigo

라우터 시스템의 마지막 구현은 [Navigo 라이브러리](https://github.com/krasimir/navigo)를 사용한다.

- 모든 라이브러리를 작성한 공개 인터페이스로 래핑하는 것이 중요하다.
- 동일한 API를 유지하면서 라우터 자체의 내부 코드만 변경하여 구현한다.
  - [Navigo를 사용한 라우터 구현](https://github.com/krasimir/navigo) (리스트 6-19)
  - [Navigo로 내부 탐색 링크](https://github.com/Apress/frameworkless-front-end-development/blob/master/Chapter06/02/index.html) (리스트 6-20)

<br>

## 3. 마무리

### 3.1. 올바른 라우터 선택하는 방법

- 세 가지 구현 간에 의미있는 차이는 없다

  → 먼저 프레임워크 없는 구현으로 시작하고, 아주 복잡한 것이 필요한 경우에만 서드파티 라이브러리로 전환할 것을 저자가 제안한다.

<br>

### 3.2. 주의점

- 프로젝트에 리액트 라우터를 사용하는 경우 단일 페이지 애플리케이션의 라우팅 시스템을 변경하기가 매우 어렵기 때문에 프로젝트에서 리액트를 제거하기 매우 어렵다.