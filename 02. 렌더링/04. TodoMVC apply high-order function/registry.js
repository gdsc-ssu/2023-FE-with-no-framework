// 2-13) 고차 함수 렌더링
const registry = {}

// renderWrapper 함수
// 원래 구성 요소를 가져와 동일한 이름의 새로운 구성요소를 반환
// 레지스트리에서 data-component 속성을 가지는 모든 DOM 요소 찾음
// 요소 발견 시 자식 구성 요소를 호출 but, 자식 구성 요소는 동일한 함수로 래핑
//      → 재귀함수와 같이 마지막 구성 요소까지 쉽게 탐색 가능   

const renderWrapper = component => {
  return (targetElement, state) => {
    const element = component(targetElement, state)

    const childComponents = element
      .querySelectorAll('[data-component]')

    Array
      .from(childComponents)
      .forEach(target => {
        const name = target
          .dataset
          .component

        const child = registry[name]
        if (!child) {
          return
        }

        target.replaceWith(child(target, state))
      })

    return element
  }
}

const add = (name, component) => {
  registry[name] = renderWrapper(component)
}

const renderRoot = (root, state) => {
  const cloneComponent = root => {
    return root.cloneNode(true)
  }

  return renderWrapper(cloneComponent)(root, state)
}

export default {
  add,
  renderRoot
}
