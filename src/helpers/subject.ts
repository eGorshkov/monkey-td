export class Subject {
  value = null;
  subscribeFunctions = [];
  constructor(v = null) {
    this.next(v);
  }
  subscribe(cb) {
    this.subscribeFunctions.push(cb);
    return this;
  }
  next(v = null) {
    this.value = v;
    this.subscribeFunctions.forEach((cb) => cb(v));
  }
  getValue() {
    return this.value;
  }
  bind(v) {
    return this.subscribe.bind(this, v);
  }
}
