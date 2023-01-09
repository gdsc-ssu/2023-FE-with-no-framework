# 1장. 프레임워크에 대한 이야기
> 프레임워크 없이 프론트엔드 애플리케이션을 개발하는 방법에 대해 배워야 하는 이유 : 때로 프레임워크 없이 작업을 수행하기 충분하지 않기 때문    

## ✅ 프레임워크란?
- 프레임워크 : 무언가를 만들 수 있는 지지 구조    
    → 소프트웨어 프레임워크의 일반적인 개념과 일치     
    - ex) 앵귤러 : `서비스`, `구성요소`, `파이프`와 같은 기본 요소를 사용해 애플리케이션을 빌드하는데 필요한 구조 제공     
- 실제 애플리케이션 스택은 다른 요소를 포함함    
    → `lodash`를 사용해 배열 or 객체를 조작하거나 `Moment.js`를 사용해 날짜를 파싱하기도 함     
    → JS 커뮤니티 : 이를 **라이브러리**로 칭함    

### ▶️ 프레임워크 vs 라이브러리
- 프레임워크 : 코드 호출
- 코드 : 라이브러리 호출
<img width="487" alt="스크린샷 2023-01-02 오후 11 30 05" src="https://user-images.githubusercontent.com/66112716/210245056-8a341337-9b42-4aec-8e02-bbfd99204a77.png">

```js
// 1-1) 앵귤러 Service 예제
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const URL = 'http://example.api.com/';

@Injectable({ 
    providedIn: 'root',
})
export class PeopleService { 
    constructor(private http: HttpClient) { }
    list() {
        return this.http.get(URL);
    }
}
```

```js
// 1-2) 앵귤러 Component 예제
import { Component, OnInit } from '@angular/core';
import { PeopleService } from '../people.service';

@Component ({
    selector: 'people-list',
    templateUrl: './people-list.component.html'
})

export class PeopleListComponent implements OnInit {
    constructor(private peopleService: PeopleService){ }

    ngOnInit() { 
        this.loadList();
    }

    loadList(): void { 
        this.peopleService.getHeroes()
            .subscribe(people => this.people = people);
    }
}
```

```js
// 1-3) Moment.js 예제
import moment from 'moment';

const DATE_FORMAT = 'DD/MM/YYYY';

export const formatDate = date => {
    return moment(date).format(DATE_FORMAT);
}
```

`Angular`는 프레임워크이고, `Moment.js`는 라이브러리    
- `Angular`(프레임워크) : 개발자 코드로 채울 수 있는 구조와 표준 작업에 도움이 되는 유틸리티 세트
- `Moment.js`(라이브러리) : 애플리케이션 코드를 어떻게 구성해야 하는지에 대해 특별한 형식을 요구하지 않음
    - 가져와 사용하기만 하면 됨
    - 공개 API를 존중하는 한 계속 사용 가능

## ✅ 프레임워크 방식
앞서 본 것과 같이 `Moment.js`는 개발자가 어떻게 코드에 통합하는지 강요하지 않음    
`Angular`는 매우 독선적    

### ▶️ 언어
- Angular : Typescript가 표준
    - 유형 검사, 어노테이션 등 원본 언어에서 존재하지 않는 기능 제공
    - Angular로 코드 작성 시 : 트랜스파일러 필요

### ▶️ 의존성 주입
- 요소가 앵귤러 애플리케이션에서 통신하도록 하기 위해 **의존성 주입 메커니즘**을 사용해 요소를 주입해야 함
- 이전 AngularJS : **서비스 로케이터 패턴**을 기반으로 하는 의존성 주입 메커니즘 존재      
    - [Inversion of Control Containers and the Dependency Injection pattern](https://martinfowler.com/articles/injection.html#UsingAServiceLocator)    
    - [번역본](https://javacan.tistory.com/entry/120)     

```js
// 1-4) AngularJS의 의존성 주입
const peopleListComponent = peopleService => {
    // 실제 코드
};

angular.component('people-list', [
    'peopleService',
    peopleListComponent
]);
```

### ▶️ 옵저버블
- 앵귤러 : 옵저버블을 사용한 반응형 프로그래밍용 라이브러리 [RxJS](https://velog.io/@teo/rxjs)를 기반으로 설계됨
    - HTTP 요청이 Promise처럼 설계되는 다른 FE 프레임워크들과 다름
        - Promise : 비동기 작업의 최종 완료 및 실패를 나타내는 표준 방법
    - `RxJS` 사용 시 옵저버블 → 프라미스, 프라미스 → 옵저버블로 쉽게 변환 가능
- 앵귤러 프로젝트에서 프라미스 기반 라이브러리를 통합해야 하는 경우 추가 작업 요구

```js
// 1-5) 옵저버블을 사용하지 않은 앵귤러 서비스
import axios from 'axios';
const URL = 'http://example.api.com/';

export default {
    list() {
        return axios.get(URL);
    }
}
```

```js
// 1-6) 옵저버블을 사용하지 않는 앵귤러 구성 요소
import people from 'people.js';

export class PeopleList {
    load() {
        people
            .list()
            .then(people => {
                this.people = people
        });
    }
}
```
> 프로젝트에 적합한 도구인지 평가하기 위해 **팀이 선택한 프레임워크의 방식을 분석하는 것**이 매우 중요하다.

### ▶️ 리액트에 대해 이야기해보자
- 리액트 홈페이지 : '사용자 인터페이스 구축을 위한 JS **라이브러리**'라고 명시
    - 리액트의 주요 제약 사항 : **선언적 패러다임의 사용**
    - DOM을 직접 조작하는 대신 **구성 요소의 상태를 수정**    
        → 리액트가 대신 DOM을 수정해줌    
    → 위 방법 : 대부분의 리액트 생태계 라이브러리에서 통용    
    - [명령형 VS 선언형 프로그래밍](https://iborymagic.tistory.com/73)    

```js
// 1-7) 리액트 Pose 애니메이션 예제
import React, { Component } from 'react';
import posed from 'react-pose';

const Box = posed.div({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    transition: {
        ease: 'linier',
        duration: 500
    }
});

class PosedExample extends Component { 
    constructor(props) {
        super(props) 
        this.state = {
            isVisible: true
        }

        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.setState({
            isVisible: !this.state.isVisible 
        })
    }

    render() {
        const { isVisible } = this.state
        const pose = isVisible ? 'visible' : 'hidden'
        return ( 
            <div>
                <Box className= 'box' pose={pose} />
                <button onClick={this.toggle}>Toggle</button>
            </div> 
            )
        }
}

export default PosedExample;
```
리액트에서 사용하는 **선언적 패턴**    

```js
// 1-8) 웹 애니메이션 API를 사용한 리액트 애니메이션
import React, { Component } from 'react';
const animationTiming = { 
    duration: 500,
    ease: 'linear',
    fill : 'forwards'
}

const showKeyframes = [ 
    { opacity: 0 },
    { opacity: 1 } 
]

const hideKeyframes = [ 
    ...showKeyframes
].reverse()

class PosedExample extends Component { 
    constructor(props) {
        super(props) 
        this.state = {
            isVisible: true
        }

    this.toggle = this.toggle.bind(this)
    }

    toggle() { 
        this.setState({
            isVisible: !this.state.isVisible
        })
    }

    componentDidUpdate(prevProps, prevstate) { 
        const { isVisible } = this.state
        if (prevState.isVisible !== isVisible) {
            const animation = isVisible ? showKeyframes : hideKeyframes
            this.div.animate(animation, animationTiming)
        }
    }

    render() {
        return (
            <div>
                <div ref={div => {this.div = div}} className='box' />
                <button onClick={this.toggle}>Toggle</button>
            </div>
        )
    }
}
```
명령형 패턴으로 사각형을 움직이는 코드    

→ 저자가 리액트가 라이브러리가 아닌 프레임워크라고 믿는 이유    
&nbsp;&nbsp;&nbsp; : **명령형 패턴** - 어떻게(How)을 중요시 여김    
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; → 제어의 흐름과 같은 방법을 제시하고 목표를 명시하지 않는 형태  
&nbsp;&nbsp;&nbsp; : **선언형 패턴** - 무엇(What)을 중요시 여김    
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; → 제어의 흐름보다 원하는 목적을 중요시 여기는 형태     
> 팁 : 작업을 처리할 때 **프레임워크 방식**을 사용하고 있다면 프레임워크라고 볼 수 있다.

## ✅ 자바스크립트 프레임워크 연혁
### ▶️ 제이쿼리
- 선택자 구문
    - ex) `var element = $('.my-class')`
- 브라우저 간 공통어를 만듦
- `ajax` 요청, 애니메이션, 기타 유틸리티 등의 기능 추가
- jqueryUI라는 공식 UIKit을 통해 웹에서 모든 요구 사항을 만족시킬 수 있게 됨

### ▶️ AngularJS
- SPA 개발에 큰 역할
- **양방향 데이터 바인딩**
    - ex) AngularJS의 지시문(디렉티브)인 `ng-model` 사용

```js
// 1-9) 앵귤러JS의 양방향 데이터 바인딩
<div ng-app="app" ng-controller="ctrl">
    Value: <input ng-model="value">
    <h1>You entered: {{value}}</h1>
</div> 

<script>
    angular
    .module('app', [])
    .controller('ctri', [ 
        '$scope',
        $scope => { 
            $scope.value = 'initial value'
        } 
    ]);
</script>
```
`$scope`의 모든 변경 사항은 DOM에 자동으로 적용됨      
입력 이벤트는 `$scope` 객체에 새로운 값을 생성함     

- 양방향 데이터 바인딩 스키마
    - 대규모 애플리케이션에 적합하지 않아 많은 개발자들이 AngularJS를 떠나게 됨
    - [양방향 바인딩 VS 단방향 바인딩 - 장단점](https://velog.io/@sunaaank/data-binding)

![image](https://user-images.githubusercontent.com/66112716/210302613-ab8248ff-e8cf-4384-a43e-60f87e3960b0.png)

### ▶️ 리액트
```js
// 1-10) 라이프사이클 메서드를 갖고 있는 기본 리액트 구성 요소
import React, { Component } from 'react';
import { render } from 'react-dom';

class Timer extends Component { 
    constructor (props) {
        super(props) 
        this.state = {
            seconds: 0
        }
    }

    componentDidMount() {
        this.interval = setInterval(() >= { 
            const { seconds } = this.state
            this.setState({
                seconds: seconds + 1
            })
        },1000) 
    }

    componentWillUnmount() { 
        clearInterval (this.interval)
    }

    render(){
        const { seconds } = this.state 
        return (
            <div>
                Seconds Elapsed: {seconds} 
            </div>
        )
    }
}

const mountNode = document. getElementById('app') 
render (<Timer></Timer>, mountNode)
```
- 리액트 : **선언적 패러다임**으로 동작
- DOM을 직접 수정하는 대신 `setState()` 메서드의 **상태를 변경**하면 리액트가 나머지 작업 수행
- 리액트는 기술적으로 보면, 프레임워크가 아닌 *렌더링 라이브러리*

### ▶️ Angular (Angular2)
- 엔터프라이즈 세계를 타깃으로 해 출시
- AngularJS (Angular1)은 SPA 개발에 사용되었으나, 대규모 애플리케이션용으로 설계된 것이 아님
    - TypeScript를 표준으로 Angular 릴리즈
        - Java, C# 개발자가 프론트엔드 애플리케이션 개발에 쉽게 접근할 수 있게 됨

### ▶️ 기술 부채
> 프로젝트에 기능을 추가할 때에는 여러 옵션이 존재한다.    
> 어떤 것은 빠르지만 지저분한 반면, 어떤 것은 잘 설계되었지만 느리다.

→ **워드 커닝 햄 - 기술 부채** 개념 도입    
- 지저분한 솔루션을 선택할수록 부채는 늘어남
    - 시간이 지남에 따라 기존 기능의 변경 및 새로운 기능의 추가에 따르는 비용이 기하급수적으로 늘어남
    
![](https://user-images.githubusercontent.com/66112716/210305160-88f7736a-4e3b-4f76-8b2e-f978211e4c21.png)

### ▶️ 프레임워크 비용
- 저자의 생각 : 모든 프레임워크가 기술 부채를 가지고 있음    
    → 최적이 아닌 방법을 선택할 때 부채가 발생하기 시작     
    → **내 문제를 해결하는 데 있어 다른 사람의 코드가 최적이 될 수 없음**     
- 미래에 코드 변경이 어렵다는 측면에서 보았을 때, **모든 프레임워크에는 비용이 발생함**
    - 프레임워크는 아키텍쳐 자체에 이미 비용을 포함함
    - 연쇄적인 비용 발생

### ▶️ 기술 투자
*기술 부채가 반드시 나쁜 것만은 아님*    
합리적인 이유로 빠른 솔루션을 사용한다면 기술 부채가 아닌 **기술 투자**가 됨    
합당한 이유로 선정된 프레임워크는 **비용이 아니라 자산**    
