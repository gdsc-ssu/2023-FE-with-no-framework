# 5장. HTTP 요청

- [개념](#개념)
  - [AJAX](#ajax)
  - [REST](#rest)
- [TODO 리스트 REST 서버](#todo-리스트-rest-서버)
  - [기본 구조](#기본-구조)
  - [XMLHttpRequest](#xmlhttprequest)
  - [Fetch](#fetch)
  - [Axios](#axios)
- [마무리](#마무리)
  - [아키텍처 검토](#아키텍처-검토)
  - [적합한 HTTP API를 선택하는 방법](#적합한-http-api를-선택하는-방법)

# 개념

## AJAX

AJAX: 비동기 자바스크립트와 XML (Asynchronous JavaScript And XML) - 최초 페이지 로드 후 필요한 데이터만 서버에서 로드하는 기술.

- 과거: 서버에서 데이터 가져올 상황에서 전체 페이지 다시 로드했어야 함.
- XMLHttpRequest 객체 이용해 HTTP 요청으로 서버에서 데이터 가져옴.
- AJAX 초기에는 서버 데이터를 XML 형식으로 수신했으나 지금은 JSON 형식 사용.

## REST

**REST**: REpresentational State Transfer. 웹 서비스를 디자인하고 개발하는 방법.

GET, POST, PUT, PATCH, DELETE 메서드 사용.

- PUT 메서드: HTTP 요청의 본문에 새로운 사용자의 모든 데이터 전달
- PATCH 메서드: 이전 상태와의 차이만 포함

---

# TODO 리스트 REST 서버

## 기본 구조

컨트롤러에서 HTTP 클라이언트를 직접 사용하는 대신, HTTP 요청을 todos 모델 객체에 래핑하는 캡슐화 사용

```tsx
const result = await todos.create(NEW_TODO_TEXT); // C
const result = await todos.list(); // R
const result = await todos.update(newTodo); // U
const result = await todos.delete(id); // D
```

- HTTP 클라이언트의 public contract:
  - http[verb](url, config)
    ```tsx
    const list = () => http.get(BASE_URL);
    const deleteTodo = (id) => http.delete(url);
    ```
  - http[verb](url, body, config)
    ```tsx
    const create = (text) => http.post(BASE_URL, todo, HEADERS);
    const update = (newTodo) => http.patch(url, newTodo, HEADERS);
    ```
- 캡슐화 장점

  1. 테스트 가능성

     todos 객체를 정적 데이터 세트를 반환하는 mock으로 바꾸는 식으로 컨트롤러의 독립적인 테스트 가능

  2. 가독성

## XMLHttpRequest

W3C가 비동기 HTTP 요청의 표준 방법을 정의한 첫 번째 시도

1. 콜백 기반인 XMLHttpRequest
   - 완료된 요청에 대한 onload 콜백
   - 오류로 끝나는 HTTP에 대한 onerror 콜백
   - 타임아웃된 요청에 대한 ontimeout 콜백
2. 프로미스 기반인 HTTP 클라이언트의 공개 API
   1. request 메서드는 표준 XMLHttpRequest 요청을 새로운 Promise 객체로 묶음
   2. 공개 메서드(get, post, put, patch, delete): request 메서드의 wrapper. 코드를 더 쉽게 읽게 해줌.

XMLHttpRequest를 사용한 HTTP 요청의 흐름

1. 새로운 XMLHttpRequest 객체 생성 (`new XMLHttpRequest()`)
2. 특정 URL로 요청을 초기화 (`xhr.open(method, url)`)
3. 요청(헤더 설정, 타임아웃 등)을 구성
4. 요청 전송 (`xhr.send(JSON.stringfy(body))`)
5. 요청이 끝날 때까지 대기
   1. 요청 성공 → onload 콜백 호출
   2. 요청 오류 → onerror 콜백 호출
   3. 요청 타임아웃 → ontimeout 콜백 호출

```tsx
const parseResponse = ({ status, responseText }) => {
  let data;
  if (status !== 204) data = JSON.parse(responseText);
  return { status, data };
};
```

```tsx
const request = ({ method = "GET", url, headers = {}, body }) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest(); // 1. 객체 생성
    xhr.open(method, url); // 2. 요청 초기화
    setHeaders(xhr, headers); // 3. 요청 구성
    xhr.send(JSON.stringify(body)); // 4. 요청 전송
    // 5. 요청이 끝날 때까지 대기
    xhr.onload = () => resolve(parseResponse(xhr)); // 성공
    xhr.onerror = () => reject(new Error("HTTP Error")); // 오류
    xhr.ontimeout = () => reject(new Error("Timeout Error")); // 타임아웃
  });
};
```

## Fetch

: 원격 리소스에 접근하고자 만들어진 API.
네트워크 객체(request, response)에 대한 표준 정의 제공 → 다른 API와 상호 운용 가능

요청 생성 시 window.fetch() 메서드 사용 → Promise 객체 반환 → response 객체를 resolve

> window.fetch()
>
> - Fetch API로 작성된 HTTP 클라이언트의 구현
> - 바로 Promise 객체 반환하기에 보일러플레이트 코드(전통적 콜백 기반 접근 방식(XMLHttpRequest)을 최신의 프로미스 기반으로 변환하기 위한) 필요 없음

Content-Type 헤더와 함께 적절한 메서드 사용해야 함

response 데이터 형식에 따라 다른 메서드(text(), blob(), json()) 사용

```tsx
const parseResponse = ({ status }) => {
  let data;
  if (status !== 204) data = await response.json();
  return { status, data };
};
```

```tsx
const request = async ({ method = "GET", url, headers = {}, body }) => {
  const config = {
    method,
    headers: new window.Headers(headers),
  };
  if (body) config.body = JSON.stringify(body);
  const response = await window.fetch(url, config);
  return parseResponse(response);
};
```

## Axios

프로미스 기반이라 fetch API와 유사하나, 브라우저와 Node.js에서 바로 사용할 수 있음.

```tsx
const request = async ({ method = "GET", url, headers = {}, body }) => {
  const config = {
    url,
    method,
    headers,
    data: body,
  };
  return axios(config);
};
```

---

# 마무리

## 아키텍처 검토

구현이 아닌 인터페이스로 프로그래밍하라: SW 디자인의 중요한 원칙.

인터페이스 : HTTP 클라이언트 = 구현 : 라이브러리

라이브러리 사용 시 이에 대한 인터페이스 생성하면 라이브러리 변경 리소스 적게 듦

## 적합한 HTTP API를 선택하는 방법

|           | XMLHttpRequest      | Fetch                                                  | Axios                                       |
| --------- | ------------------- | ------------------------------------------------------ | ------------------------------------------- |
| 호환성    |                     | 😰 최신 브라우저에서만 동작                            |                                             |
| 휴대성    | 브라우저에서만 동작 | 브라우저에서만 동작                                    | 😀Node.js나 RN 같은 다른 JS 환경에서도 동작 |
| 발전성    |                     | 네트워크 관련 객체(Request, response)의 표준 정의 제공 |                                             |
| 보안      |                     |                                                        | 😀XSR, XSRF에 대한 보호 시스템 내장         |
| 학습 곡선 | 😰콜백 작업…        |                                                        |                                             |
