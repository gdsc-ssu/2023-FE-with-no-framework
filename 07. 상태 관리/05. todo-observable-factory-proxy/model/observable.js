const cloneDeep = (x) => {
  return JSON.parse(JSON.stringify(x));
};

const freeze = (x) => Object.freeze(cloneDeep(x));

export default (initalState) => {
  let listeners = [];

  // Proxy API 를 통해 proxy 생성
  const proxy = new Proxy(cloneDeep(initalState), {
    set: (target, name, value) => {
      target[name] = value;
      listeners.forEach((l) => l(freeze(proxy)));
      return true;
    },
  });

  proxy.addChangeListener = (cb) => {
    listeners.push(cb);
    cb(freeze(proxy));

    return () => {
      listeners = listeners.filter((l) => l !== cb);
    };
  };

  return proxy;
};
