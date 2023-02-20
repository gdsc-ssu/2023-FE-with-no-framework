const isNodeChanged = (node1, node2) => {
  // 1. 속성 수가 다른지 체크하기
  const n1Attr = node1.attributes;
  const n2Attr = node2.attributes;
  if (n1Attr.length !== n2Attr.length) return true;

  // 2. 속성 값이 하나라도 변경되었는지 확인하기
  const differentAttr = Array.from(n1Attr).find((attr) => {
    const { name } = attr;
    const attr1 = node1.getAttribute(name);
    const attr2 = node2.getAttribute(name);
    return attr1 !== attr2;
  });
  if (differentAttr) return true;

  // 3. 자식이 없는 노드 중 textContent가 변경되었는지 확인하기
  if (
    node1.children.length === 0 &&
    node2.children.length === 0 &&
    node1.textContent !== node2.textContent
  ) {
    return true;
  }

  return false;
};

const applyDiff = (parentNode, realNode, virtualNode) => {
  if (realNode && !virtualNode) {
    realNode.remove();
    return;
  }

  if (!realNode && virtualNode) {
    parentNode.appendChild(virtualNode);
    return;
  }

  if (isNodeChanged(virtualNode, realNode)) {
    realNode.replaceWith(virtualNode);
    return;
  }

  const realChildren = Array.from(realNode.children);
  const virtualChildren = Array.from(virtualNode.children);

  const max = Math.max(realChildren.length, virtualChildren.length);

  for (let i = 0; i < max; i++) {
    applyDiff(realNode, realChildren[i], virtualChildren[i]);
  }
};

export default applyDiff;
