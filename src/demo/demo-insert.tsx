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

export const DemoInsert = () => {
  // const handleClick = () => inserDemo1();

  const EVENT_NANME = "INSERT";

  useEffect(() => {
    const list: any[] = [];
    const b1 = new BulletLog({
      title: "Insert Object",
      description: `
      // insert a new object into the 'insert1' collection
      const insertResponse = await createDeclarativeBulletApi()
        .body({ test: 1, guid })
        .collection((c) => c.name("insert1").method(BULLET_METHOD.INSERT))
        .execute()
      
      `,
    });
    b1.func = () => insertObject1(b1);
    list.push(b1);

    //------------------------

    const bcol = new BulletLog({
      title: "Insert Object into my collection",
      description: `

      // collection.owned is true so the collection name will be:  name + tokenObj._id
      const insertResponse = await createDeclarativeBulletApi()
        .body({ test: 1, guid })
        .collection((c) =>
          c.name("insert1").owned(true).method(BULLET_METHOD.INSERT)
        )
        .execute()
      `,
    });
    bcol.func = () => insertObject_my_collection(bcol);
    list.push(bcol);

    //------------------------

    const bguid = new BulletLog({
      title: "Insert Object into collection.name + guid",
      description: `

      // collection.useGuid is true so the collection name will be:  name + guid
      const insertResponse = await createDeclarativeBulletApi()
        .body({ test: 1, guid })
        .collection((c) =>
          c.name("insert1").useGuid(true).method(BULLET_METHOD.INSERT)
        )
        .execute()
      `,
    });
    bguid.func = () => insertObject_guid_collection(bguid);
    list.push(bguid);

    //------------------------

    const bDate = new BulletLog({
      title: "Insert Object containing date constraint",
      description: `
      // insert a new object into the 'constraints_date' collection
      // my_date_value have the type equal 'date'
      // decorate the object with a new field "my_date_value_as_ms" as a result of dateAsTimeMilliseconds method with 
      // the input parameter equal the "send" result

      // to set up the constraints, go to /bulletcollections and set constraints as shown below
      // 1. select constraints_date collection
      // 2. set sample document to be: {my_date_value: '2022/12/12'}
      // 3. set the my_date_value as "optional"

      const insertResponse = await createDeclarativeBulletApi()
        .body({ test: 2, guid, my_date_value: new Date() })
        .bodyField("my_date_value_as_ms", (f) =>
            f.moduleFunction((mf) => mf.method("dateAsTimeMilliseconds"))
            .send((s) => s.fields("my_date_value"))
        )
        .collection((c) =>
          c.name(CONSTRAINTS_COLLECTION).method(BULLET_METHOD.INSERT)
        )
        .execute()
      
      `,
    });
    bDate.func = () => insertObjectWithDate(bDate);
    list.push(bDate);

    //------------------------

    const bDateInvalidConstraint = new BulletLog({
      title: "Insert Object containing invalid date constraint",
      description: `
      // insert a new object into the 'insert1' collection
      // my_date_value will is no a date time value
      // so, in this case, a error is thrown
      
      const insertResponse = await createDeclarativeBulletApi()
      .body({ test: 2, guid, my_date_value: 1 })
      .collection((c) => c.name("constraints_date").method(BULLET_METHOD.INSERT))
      .execute()
      
      `,
    });
    bDateInvalidConstraint.func = () =>
      insertObjectWithInvalidDateConstraint(bDateInvalidConstraint);
    list.push(bDateInvalidConstraint);

    //------------------------

    const b2 = new BulletLog({
      title: "Insert Array of Objects",
      description: `
      const insertResponse = await createDeclarativeBulletApi()
        .body([
          { test: 1, guid },
          { test: 2, guid },
        ])
        .collection((c) =>
          c.name("insert_bulk_collection").method(BULLET_METHOD.INSERT)
        )
        .execute()
      `,
    });
    b2.func = () => inserArray2(b2);
    list.push(b2);

    //------------------------

    const b3 = new BulletLog({
      title: "insert  - new prop is added by calling predefined guid method",
      description: `
      newProp field is populated with the result of "guid" method

      const insertResponse = await createDeclarativeBulletApi()
      .body({ test: 1, guid, willbedeleted: 1 })
      .bodyField("s", (b) => b.moduleFunction((d) => d.method("guid")))
      .bodyField("", (b) =>
        b.moduleFunction((d) =>
          d.method("deleteProperty").paramValue("willbedeleted")
        )
      )
      .collection((c) => c.name("insert1").method(BULLET_METHOD.INSERT))
      .execute()
      `,
    });
    b3.func = () => inser_PredefinedFunction3(b3);
    list.push(b3);

    //------------------------
    const b4 = new BulletLog({
      title:
        "insert  - new prop is added by calling my_module.my_custom_function method",
      description: `
      go to dashboard and define the my_module and my_custom_function signature

      const insertResponse = await createDeclarativeBulletApi()
      .body({ test: 1, guid, name: "claudiu gombos" })
      .bodyField('newProp', b=>b.moduleFunction(f=>f.method('my_custom_function').module("my_module")))
      .collection((c) => c.name("insert1").method(BULLET_METHOD.INSERT))
      .execute()
      `,
    });
    b4.func = () => insert_ModuleFunction4(b4);
    list.push(b4);

    //------------------------

    const b5 = new BulletLog({
      title:
        "insert  - new prop is added by calling a rest api method on a specific route",
      description: `

      go to bullet key dashboard and define the bulletkey / personalServerUrl value

      const insertResponse = await createDeclarativeBulletApi()
        .body({ test: 1, guid, name: "claudiu gombos" })
        .bodyField("newProp3", (x) =>
          x.route("/api/public/v1/currentdate").take((t) => t.fields("data.date"))
        )
        .collection((c) => c.name("insert1").method(BULLET_METHOD.INSERT))
        .execute()
      `,
    });
    b5.func = () => inserDemo3_BodyFieldMyServer(b5);
    list.push(b5);

    //
    store.setEventValues(EVENT_NANME, list, true);
  }, []);

  const handleClick = () =>
    helpers.chain1([
      insertObject1,
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

const insertObject1 = async (bulletLog: BulletLog) => {
  await checkPrerequisites();

  const guid = utils.createUUID();
  let apiBulletRequest = null;

  const insertResponse = await createDeclarativeBulletApi()
    .body({ test: 1, guid })
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

const insertObjectWithDate = async (bulletLog: BulletLog) => {
  await checkPrerequisites();

  const guid = utils.createUUID();
  let apiBulletRequest = null;

  const CONSTRAINTS_COLLECTION = "constraints_date";

  const insertResponse = await createDeclarativeBulletApi()
    .body({ test: 2, guid, my_date_value: new Date() })
    .bodyField("my_date_value_as_ms", (f) =>
      f
        .moduleFunction((mf) => mf.method("dateAsTimeMilliseconds"))
        .send((s) => s.fields("my_date_value"))
    )
    .collection((c) =>
      c.name(CONSTRAINTS_COLLECTION).method(BULLET_METHOD.INSERT)
    )
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        apiBulletRequest = apiBulletJSON;
      },
    });

  let vRequest = null;
  const findResponse = await createDeclarativeBulletApi()
    .body({ guid })
    .collection((c) =>
      c.name(CONSTRAINTS_COLLECTION).method(BULLET_METHOD.FIND)
    )
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

const insertObjectWithInvalidDateConstraint = async (bulletLog: BulletLog) => {
  await checkPrerequisites();

  const guid = utils.createUUID();
  let apiBulletRequest = null;

  const CONSTRAINTS_COLLECTION = "constraints_date";

  const insertResponse = await createDeclarativeBulletApi()
    .body({ test: 2, guid, my_date_value: 1 })

    .collection((c) =>
      c.name(CONSTRAINTS_COLLECTION).method(BULLET_METHOD.INSERT)
    )
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        apiBulletRequest = apiBulletJSON;
      },
    });

  let vRequest = null;
  const findResponse = await createDeclarativeBulletApi()
    .body({ guid })
    .collection((c) =>
      c.name(CONSTRAINTS_COLLECTION).method(BULLET_METHOD.FIND)
    )
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

const inserArray2 = async (bulletLog: BulletLog) => {
  await checkPrerequisites();

  const guid = utils.createUUID();
  let apiBulletRequest = null;

  const insertResponse = await createDeclarativeBulletApi()
    .body([
      { test: 1, guid },
      { test: 2, guid },
    ])
    .collection((c) =>
      c.name("insert_bulk_collection").method(BULLET_METHOD.INSERT)
    )
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        apiBulletRequest = apiBulletJSON;
      },
    });

  let vRequest = null;
  const findResponse = await createDeclarativeBulletApi()
    .body({ guid })
    .collection((c) =>
      c.name("insert_bulk_collection").method(BULLET_METHOD.FIND)
    )
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

const inser_PredefinedFunction3 = async (bulletLog: BulletLog) => {
  await checkPrerequisites();

  const guid = utils.createUUID();
  let apiBulletRequest = null;

  const insertResponse = await createDeclarativeBulletApi()
    .body({ test: 1, guid, willbedeleted: 1 })
    .bodyField("s", (b) => b.moduleFunction((d) => d.method("guid")))
    .bodyField("", (b) =>
      b.moduleFunction((d) =>
        d.method("deleteProperty").paramValue("willbedeleted")
      )
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

const insert_ModuleFunction4 = async (bulletLog: BulletLog) => {
  await checkPrerequisites();
  const guid = utils.createUUID();
  let apiBulletRequest = null;

  const insertResponse = await createDeclarativeBulletApi()
    .body({ test: 1, guid, name: "claudiu gombos" })
    .bodyField("newProp", (b) =>
      b.moduleFunction((f) =>
        f.method("my_custom_function").module("my_module")
      )
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

const insertObject_my_collection = async (bulletLog: BulletLog) => {
  await checkPrerequisites();

  const guid = utils.createUUID();
  let apiBulletRequest = null;

  const insertResponse = await createDeclarativeBulletApi()
    .body({ test: 1, guid })
    .collection((c) =>
      c.name("insert1").owned(true).method(BULLET_METHOD.INSERT)
    )
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        apiBulletRequest = apiBulletJSON;
      },
    });

  let vRequest = null;
  const findResponse = await createDeclarativeBulletApi()
    .body({ guid })
    .collection((c) => c.name("insert1").owned(true).method(BULLET_METHOD.FIND))
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

const insertObject_guid_collection = async (bulletLog: BulletLog) => {
  await checkPrerequisites();

  const guid = utils.createUUID();
  let apiBulletRequest = null;

  const insertResponse = await createDeclarativeBulletApi()
    .body({ test: 1, guid })
    .collection((c) =>
      c.name("insert1").useGuid(true).method(BULLET_METHOD.INSERT)
    )
    .execute({
      beforeSendingRequest: (apiBulletJSON: any) => {
        apiBulletRequest = apiBulletJSON;
      },
    });

  let vRequest = null;
  const findResponse = await createDeclarativeBulletApi()
    .body({ guid })
    .collection((c) =>
      c.name("insert1").useGuid(true).method(BULLET_METHOD.FIND)
    )
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
