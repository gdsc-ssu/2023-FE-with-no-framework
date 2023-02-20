const cloneDeep = (x) => {
  return JSON.parse(JSON.stringify(x));
};

const freeze = (x) => Object.freeze(cloneDeep(x));

export default (model) => {
  let listeners = [];
  let state = model();

  const subscribe = (listener) => {
    listeners.push(listener);

    return () => {
      listeners = listener.filter((l) => l !== listener);
    };
  };

  const invokeSubscribers = () => {
    const data = freeze(state);
    listeners.forEach((l) => l(data));
  };

  const dispatch = (event) => {
    const newState = model(state, event);

    if (!newState) {
      throw new Error('model should always return a value');
    }

    // 이전 상태아 새 상태가 동일하면 구독자를 건너뛴다.
    if (newState === state) {
      return;
    }

    // 항상 새로운 객체로 업데이트한다.
    state = newState;

    invokeSubscribers();
  };

  return {
    subscribe,
    dispatch,
    getState: () => freeze(state),
  };
};
