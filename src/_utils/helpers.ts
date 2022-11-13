class Helper {
  promiseDelay(seconds = 1000) {
    return new Promise((res, rej) => {
      const timerId = setTimeout(() => {
        clearTimeout(timerId);
        console.log("delay ", new Date());
        res(2);
      }, 2000);
    });
  }

  executeFunction(funcRef: Function, value: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(funcRef(value));
      }, 100);
    });
  }

  chain1(functionsList: Function[], value?: any) {
    return functionsList.reduce((prev, next) => {
      return prev.then((value) => {
        return next(value);
      });
    }, Promise.resolve(value));
  }

  chain2(functionsList: Function[], value: any) {
    return functionsList.reduce((prev, next) => {
      return prev.then((value) => this.executeFunction(next, value));
    }, Promise.resolve(value));
  }

  chain3_recursion(functionsList: Function[], value: any) {
    if (!functionsList.length) {
      return Promise.resolve(value);
    }
    const firstFunction: Function | undefined = functionsList.shift();

    if (!firstFunction) {
      return Promise.resolve(value);
    }
    return firstFunction(value)
      .then((v: any) => this.chain3_recursion(functionsList, v))
      .catch((ex: any) => this.chain3_recursion(functionsList, value));
  }

  getBlobFromUrl(url: string, callback: Function) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      callback(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }
}

const helpers = new Helper();

export { helpers };
