import observer from "../_observer/observer";

class Store {
  dict: any = {};

  get(key: string, defaultValue?: any): any {
    return this.dict[key] || defaultValue;
  }

  set(key: string, value: any) {
    this.dict[key] = value;
  }

  remove(key: string) {
    delete this.dict[key];
  }

  push(eventName: string, data: any, emit = false) {
    if (!this.dict[eventName]) {
      this.dict[eventName] = [];
    }
    const ref = this.dict[eventName];
    if (Array.isArray(data)) {
      data.forEach(function (el) {
        ref.push(el);
      });
    } else {
      ref.push(data);
    }

    if (emit) {
      observer.publish(eventName, null);
    }
  }

  setEventValues(eventName: string, data: any, emit = false) {
    this.dict[eventName] = [];
    this.push(eventName, data, emit);
  }

  publish(eventName: string, data = null) {
    observer.publish(eventName, data);
  }

  clear(eventName: string) {
    delete this.dict[eventName];
  }
}

const store = new Store();

export { store };
