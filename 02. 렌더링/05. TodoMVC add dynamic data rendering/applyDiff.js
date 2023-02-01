const isNodeChanged = (node1, node2) => {
  const n1Attributes = node1.attributes
  const n2Attributes = node2.attributes
  if (n1Attributes.length !== n2Attributes.length) {
    return true
  }

  const differentAttribute = Array
    .from(n1Attributes)
    .find(attribute => {
      const { name } = attribute
      const attribute1 = node1
        .getAttribute(name)
      const attribute2 = node2
        .getAttribute(name)

      return attribute1 !== attribute2
    })

  if (differentAttribute) {
    return true
  }

  if (node1.children.length === 0 &&
    node2.children.length === 0 &&
    node1.textContent !== node2.textContent) {
    return true
  }

  return false
}

// applyDiff(현재 DOM 노드, 실제 DOM 노드, 새로운 가상 DOM 노드의 부모)
const applyDiff = (
  parentNode,
  realNode,
  virtualNode) => {
  // 1. 새 노드가 정의되지 않은 경우 실제 노드 삭제   
  if (realNode && !virtualNode) {
    realNode.remove()
    return
  }

  // 2. 실제 노드가 정의되지 않았지만 가상 노드가 존재하는 경우, 부모 노드에 추가   
  if (!realNode && virtualNode) {
    parentNode.appendChild(virtualNode)
    return
  }

  // 3. 두 노드가 모두 정의된 경우, 두 노드 간 차이 확인   
  if (isNodeChanged(virtualNode, realNode)) {
    realNode.replaceWith(virtualNode)
    return
  }

  // 하위 노드에 대한 동일한 Diff 알고리즘 적용
  const realChildren = Array.from(realNode.children)
  const virtualChildren = Array.from(virtualNode.children)

  const max = Math.max(
    realChildren.length,
    virtualChildren.length
  )
  for (let i = 0; i < max; i++) {
    applyDiff(
      realNode,
      realChildren[i],
      virtualChildren[i]
    )
  }
}

export default applyDiff
