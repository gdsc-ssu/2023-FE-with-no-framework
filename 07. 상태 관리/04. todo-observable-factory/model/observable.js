const cloneDeep = (x) => {
  return JSON.parse(JSON.stringify(x));
};

const freeze = (x) => Object.freeze(cloneDeep(x));

/**
 * 옵저버블 팩토리
 * @param model 각종 이벤트 함수들이 담겨있는 Model 객체
 * @param stateGetter 현재 state를 반환하는 게터 함수
 */
export default (model, stateGetter) => {
  let listeners = [];

  const addChangeListener = (cb) => {
    listeners.push(cb);
    cb(freeze(stateGetter()));

    return () => {
      listeners = listeners.filter((l) => l !== cb);
    };
  };

  // 리스너들에게 현재 state를 전달 후 호출한다.
  const invokeListeners = () => {
    const data = freeze(stateGetter());
    listeners.forEach((l) => l(data));
  };

  // 리스너를 호출하는 동일한 이름의 action을 반환한다.
  const wrapAction = (originalAction) => {
    return (...args) => {
      const value = originalAction(...args);
      invokeListeners();
      return value;
    };
  };

  const baseProxy = {
    addChangeListener,
  };

  return Object.keys(model)
    .filter((key) => {
      return typeof model[key] === 'function';
    })
    .reduce((proxy, key) => {
      const action = model[key];
      return { ...proxy, [key]: wrapAction(action) };
    }, baseProxy);
};
