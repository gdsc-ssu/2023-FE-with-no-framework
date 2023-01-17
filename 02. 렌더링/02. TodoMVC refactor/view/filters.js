// 2-9) TodoMVC 필터를 렌더링하는 뷰 함수
export default (targetElement, { currentFilter }) => {
  const newCounter = targetElement.cloneNode(true)
  Array
    .from(newCounter.querySelectorAll('li a'))
    .forEach(a => {
      if (a.textContent === currentFilter) {
        a.classList.add('selected')
      } else {
        a.classList.remove('selected')
      }
    })
  return newCounter
}
