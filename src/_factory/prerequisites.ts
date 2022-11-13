import DeclarativeBulletApi from "declarative-fluent-bullet-api/declarative-bullet-api";
import BulletHttpRequestLibrary from "declarative-fluent-bullet-api/BulletHttpRequestLibrary";

import { store } from "../_store/store";
import { BULLET_IO_URL } from "../constants";

async function prerequisites() {
  await loginBulletIO_01();

  // await createBulletKey_02();
}

function createBulletHttpRequestLibrary() {
  const bulletKey = store.get("BULLET_KEY");
  if (!bulletKey) {
    throw new Error("no bullet key");
  }

  return new BulletHttpRequestLibrary({
    authentication: bulletKey,
    serverUrl: BULLET_IO_URL(),
  });
}

function getCredentials() {
  const creadentials = {
    email: store.get("USERNAME") || "claudiu9379@yahoo.com",
    password: store.get("PASSWORD") || "a1",
  };

  return creadentials;
}

function loginBulletIO_01() {
  //const route = `${SETTINGS.BULLET_IO_URL}/api/pub/security/login`;
  // const route = `${BULLET_IO_URL()}/api/user/v1/login`;

  const creadentials = getCredentials();
  let response: any = null;

  return createBulletHttpRequestLibrary()
    .login(getCredentials())
    .then((value) => {
      response = value;

      if (!value.success) {
        return null;
      }
      store.set("BULLET_IO_USER", value.data);
      return value.data;

      // createBulletKey_02();
    })
    .finally(() => {
      store.push(
        "LOGS",
        {
          request: creadentials,
          response,
          title: "login",
          execute: loginBulletIO_01,
        },
        true
      );
    });
}

const createDeclarativeBulletApi = (token = "") => {
  let authentication = token;
  if (!authentication) {
    authentication = (store.get("BULLET_IO_USER") || {}).token;
  }

  if (!authentication) {
    throw "no token. please get a token first ";
  }

  return new DeclarativeBulletApi({
    authentication,
    serverUrl: BULLET_IO_URL(),
  });
};

export {
  prerequisites,
  createDeclarativeBulletApi,
  createBulletHttpRequestLibrary,
  loginBulletIO_01,
};
