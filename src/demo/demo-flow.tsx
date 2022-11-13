import { BULLET_METHOD } from "declarative-fluent-bullet-api/fluent/constants";
import { useEffect } from "react";
import {
  createDeclarativeBulletApi,
  loginBulletIO_01,
} from "../_factory/prerequisites";
import { utils } from "../_utils/utils";
import { store } from "../_store/store";
import { BulletLogsComponent } from "../_components/bullet-logs-component";
import BulletLog from "../_models/BulletLog";
import { helpers } from "../_utils/helpers";
import { UserPassword } from "../user/user-password";

export const DemoFlow = () => {
  // const handleClick = () => inserDemo1();

  const EVENT_NANME = "INSERT";

  useEffect(() => {
    const list: any[] = [];
    const b1 = new BulletLog({
      title: "Insert Object if not exists",
      description: `

      execution steps:
      1. search into insert1 collection for an object having guid value
      2. check the stop condition by calling the exists method from my_module (created from dashboard)
      3. if object is found --> throw exception with code equal "errorcode"
      4. if object is not found --> execute the rest part of the flow (which inserts the data)

      const insertResponse = await createDeclarativeBulletApi()
        .find((f) => f.findByObject({ guid }))
        .collection((c) => c.name("insert1").method(BULLET_METHOD.FIND_ONE))
        .flow((f) =>
          f
            .stopIf((e) =>
              e
                .errorcode("as")
                .moduleFunction((mf) => mf.method("exists").module("my_module"))
            )

            .body({ guid, a: 1 })
            .collection((c) => c.name("insert1").method(BULLET_METHOD.INSERT))
        )
        .execute()
      `,
    });
    b1.func = () => flow1(b1);
    list.push(b1);

    //------------------------

    const b2 = new BulletLog({
      title: `Insert into collection1 followed by another flow which inserts into collection2
      the collection2 response is returned under the collection2response key
      `,
      description: `
      const insertResponse = await createDeclarativeBulletApi()
        .body({ guid, a: 1 })
        .collection((c) => c.name("collection1").method(BULLET_METHOD.INSERT))
        .flow((f) =>
          f
            .body({ guid, a: 2 })
            .collection((c) => c.name("collection2").method(BULLET_METHOD.INSERT))
            .key("collection2response")
        )
        .execute()
      `,
    });
    b2.func = () => flow2(b2);
    list.push(b2);

    //------------------------

    const b3 = new BulletLog({
      title: "2 inserts and returns _id's with key and alias",
      description: `
      newProp field is populated with the result of "guid" method

      const insertResponse = await createDeclarativeBulletApi()
        .body({ guid, a: 1 })
        .collection((c) => c.name("collection1").method(BULLET_METHOD.INSERT))
        .flow((f) =>
          f
            .body({ guid, a: 2 })
            .collection((c) => c.name("collection2").method(BULLET_METHOD.INSERT))
            .key("collection2response")
            .take((t) => t.addFromInto((f) => f.from("_id").into("id2")))
        )
        .execute()
      `,
    });
    b3.func = () => flow3(b3);
    list.push(b3);

    //------------------------
    const b4 = new BulletLog({
      title: "2 inserts and returns _id's with  alias",
      description: `
      inserts 2 records, and return the new inserted _id's with alias

      const insertResponse = await createDeclarativeBulletApi()
      .body({ guid, a: 1 })
      .collection((c) => c.name("collection1").method(BULLET_METHOD.INSERT))
      .flow((f) =>
        f
          .body({ guid, a: 2 })
          .collection((c) => c.name("collection2").method(BULLET_METHOD.INSERT))
          .take((t) => t.addFromInto((f) => f.from("_id").into("my_id")))
      )
      .execute()
      `,
    });
    b4.func = () => flow4(b4);
    list.push(b4);

    //------------------------

    //
    store.setEventValues(EVENT_NANME, list, true);
  }, []);

  const handleClick = () =>
    helpers.chain1([
      flow1,
      // wait,
      // inserArray2,
      // inser_PredefinedFunction3,
      // insert_ModuleFunction4,
      // inserDemo3_BodyFieldMyServer,
    ]);
  // inserDemo1().then(() => wait().then(() => inserDemoBulk()));

  // useEffect(() => {
  //   getBulletToken();
  // }, []);

  return (
    <>
      <div>
        <UserPassword></UserPassword>
      </div>
      <div>
        <BulletLogsComponent eventName="LOGS"></BulletLogsComponent>
      </div>
      {/* <button type="button" onClick={handleClick}>
        execute
      </button> */}
      <BulletLogsComponent eventName={EVENT_NANME}></BulletLogsComponent>
    </>
  );
};

const wait = (seconds = 1000) => {
  return new Promise((resolve, reject) => {
    const timerId = setTimeout(() => {
      clearTimeout(timerId);
      resolve(1);
    }, seconds);
  });
};

const checkPrerequisites = async () => {
  let { token } = store.get("BULLET_IO_USER") || {};
  if (!token) {
    token = await loginBulletIO_01();
  }
};

const flow1 = async (bulletLog: BulletLog) => {
  await checkPrerequisites();

  const guid = "7f229c90-f89d-18e9-ca34-8a9bde608fd9";
  // utils.createUUID();
  let apiBulletRequest = null;

  const insertResponse = await createDeclarativeBulletApi()
    .find((f) => f.findByObject({ guid }))
    .collection((c) => c.name("insert1").method(BULLET_METHOD.FIND_ONE))
    .flow((f) =>
      f
        .stopIf((e) =>
          e
            .errorcode("as")
            .moduleFunction((mf) => mf.method("exists").module("my_module"))
        )

        .body({ guid, a: 1 })
        .collection((c) => c.name("insert1").method(BULLET_METHOD.INSERT))
    )
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        apiBulletRequest = apiBulletJSON;
      },
    });

  let vRequest = null;
  const findResponse = await createDeclarativeBulletApi()
    .body({ guid })
    .collection((c) => c.name("insert1").method(BULLET_METHOD.FIND_ONE))
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        vRequest = apiBulletJSON;
      },
    });

  const bulletLogVerify: BulletLog = new BulletLog({});
  bulletLogVerify.route = "insert1-verify";
  bulletLogVerify.request = vRequest;
  bulletLogVerify.response = findResponse;

  bulletLog.route = "insert1";
  bulletLog.request = apiBulletRequest;
  bulletLog.response = insertResponse;
  bulletLog.verify = bulletLogVerify;
};

const flow2 = async (bulletLog: BulletLog) => {
  await checkPrerequisites();

  const guid = "1f229c90-f89d-18e9-ca34-8a9bde608fd4";
  // utils.createUUID();
  let apiBulletRequest = null;

  const insertResponse = await createDeclarativeBulletApi()
    .body({ guid, a: 1 })
    .collection((c) => c.name("collection1").method(BULLET_METHOD.INSERT))
    .flow((f) =>
      f
        .body({ guid, a: 2 })
        .collection((c) => c.name("collection2").method(BULLET_METHOD.INSERT))
        .key("collection2response")
    )
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        apiBulletRequest = apiBulletJSON;
      },
    });

  let vRequest = null;
  const findResponse = await createDeclarativeBulletApi()
    .body({ guid })
    .collection((c) => c.name("collection1").method(BULLET_METHOD.FIND_ONE))
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        vRequest = apiBulletJSON;
      },
    });

  const bulletLogVerify: BulletLog = new BulletLog({});
  bulletLogVerify.route = "insert1-verify";
  bulletLogVerify.request = vRequest;
  bulletLogVerify.response = findResponse;

  bulletLog.route = "insert1";
  bulletLog.request = apiBulletRequest;
  bulletLog.response = insertResponse;
  bulletLog.verify = bulletLogVerify;
};

const flow3 = async (bulletLog: BulletLog) => {
  await checkPrerequisites();

  const guid = "1f229c90-f89d-18e9-ca34-8a9bde608fd4";
  // utils.createUUID();
  let apiBulletRequest = null;

  const insertResponse = await createDeclarativeBulletApi()
    .body({ guid, a: 1 })
    .collection((c) => c.name("collection1").method(BULLET_METHOD.INSERT))
    .flow((f) =>
      f
        .body({ guid, a: 2 })
        .collection((c) => c.name("collection2").method(BULLET_METHOD.INSERT))
        .key("collection2response")
        .take((t) => t.addFromInto((f) => f.from("_id").into("id2")))
    )
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        apiBulletRequest = apiBulletJSON;
      },
    });

  let vRequest = null;
  const findResponse = await createDeclarativeBulletApi()
    .body({ guid })
    .collection((c) => c.name("collection1").method(BULLET_METHOD.FIND_ONE))
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        vRequest = apiBulletJSON;
      },
    });

  const bulletLogVerify: BulletLog = new BulletLog({});
  bulletLogVerify.route = "insert1-verify";
  bulletLogVerify.request = vRequest;
  bulletLogVerify.response = findResponse;

  bulletLog.route = "insert1";
  bulletLog.request = apiBulletRequest;
  bulletLog.response = insertResponse;
  bulletLog.verify = bulletLogVerify;
};

const flow4 = async (bulletLog: BulletLog) => {
  await checkPrerequisites();

  const guid = "1f229c90-f89d-18e9-ca34-8a9bde608fd4";
  // utils.createUUID();
  let apiBulletRequest = null;

  const insertResponse = await createDeclarativeBulletApi()
    .body({ guid, a: 1 })
    .collection((c) => c.name("collection1").method(BULLET_METHOD.INSERT))
    .flow((f) =>
      f
        .body({ guid, a: 2 })
        .collection((c) => c.name("collection2").method(BULLET_METHOD.INSERT))
        .take((t) => t.addFromInto((f) => f.from("_id").into("my_id")))
    )
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        apiBulletRequest = apiBulletJSON;
      },
    });

  let vRequest = null;
  const findResponse = await createDeclarativeBulletApi()
    .body({ guid })
    .collection((c) => c.name("collection1").method(BULLET_METHOD.FIND_ONE))
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        vRequest = apiBulletJSON;
      },
    });

  const bulletLogVerify: BulletLog = new BulletLog({});
  bulletLogVerify.route = "insert1-verify";
  bulletLogVerify.request = vRequest;
  bulletLogVerify.response = findResponse;

  bulletLog.route = "insert1";
  bulletLog.request = apiBulletRequest;
  bulletLog.response = insertResponse;
  bulletLog.verify = bulletLogVerify;
};

const inserDemo3_BodyFieldMyServer = async (bulletLog: BulletLog) => {
  await checkPrerequisites();

  const guid = utils.createUUID();
  let apiBulletRequest = null;

  const insertResponse = await createDeclarativeBulletApi()
    .body({ test: 1, guid, name: "claudiu gombos" })
    .bodyField("newProp3", (x) =>
      x.route("/api/public/v1/currentdate").take((t) => t.fields("data.date"))
    )
    .collection((c) => c.name("insert1").method(BULLET_METHOD.INSERT))
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        apiBulletRequest = apiBulletJSON;
      },
    });

  let vRequest = null;
  const findResponse = await createDeclarativeBulletApi()
    .body({ guid })
    .collection((c) => c.name("insert1").method(BULLET_METHOD.FIND))
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        vRequest = apiBulletJSON;
      },
    });

  const bulletLogVerify: BulletLog = new BulletLog({});
  bulletLogVerify.route = "insert1-verify";
  bulletLogVerify.request = vRequest;
  bulletLogVerify.response = findResponse;

  bulletLog.route = "insert1";
  bulletLog.request = apiBulletRequest;
  bulletLog.response = insertResponse;
  bulletLog.verify = bulletLogVerify;
};
