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

export const DemoFind = () => {
  // const handleClick = () => inserDemo1();

  const EVENT_NANME = "FIND";
  const FIND_COLLECTION = "find_collection";

  const getSampleData = () => {
    return store.get("FIND_SAMPLE_DATA");
  };

  useEffect(() => {
    const list: any[] = [];

    /* #region  data prerequisites */
    const dataBullet = new BulletLog({
      title: "insert sample data used by below finding examples",
      description: `

      const insertResponse = await createDeclarativeBulletApi()
        .body({
          test: 1,
          guid,
          age: 5,
          weight: 500,
          items: [
            {
              id: 1,
              color: "red",
            },
            { id: 2, color: "blue" },
          ],
          categoryName: "flowers",
        })
        .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.INSERT))
        .execute()
      `,
    });

    dataBullet.func = () => insertObjectPrerequisites(dataBullet);

    list.push(dataBullet);
    store.set("FIND_PREREQ", dataBullet);

    /* #endregion */

    //------------------------

    /* #region  find by _id */
    const b1 = new BulletLog({
      title: "find by _id (from body)",
      description: `
      // get the information from database by _id 
      // and returns only the  age as age Property and test as testProperty
      const response = await createDeclarativeBulletApi()
      .body({ _id: sampleData[0]._id })
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .take((t) =>
        t
          .addFromInto((ft) => ft.from("age").into("ageProperty"))
          .addFromInto((ft) => ft.from("test").into("testProperty"))
      )
      .execute()
      `,
    });
    b1.func = () => findBy_id(b1);
    list.push(b1);
    /* #endregion */

    //------------------------

    /* #region  find by guid (from body) */
    const b2 = new BulletLog({
      title: "find by guid (from body)",
      description: `
      // returns the data by guid and 
      // returns only the age and test properties
      const response = await createDeclarativeBulletApi()
      .body({ guid: sampleData[0].guid })
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .take((t) => t.fields("age,test"))
      .execute()
      `,
    });
    b2.func = () => findBy_GuidWithBody(b2);

    list.push(b2);
    /* #endregion */

    //------------------------

    /* #region  find by _id */
    const b3 = new BulletLog({
      title: "find by _id (with find by object)",
      description: `
      // get the data from db by _id and 
      // returns the response as MY_KEY
      const response = await createDeclarativeBulletApi()
      .find((el) => el.findByObject({ _id: sampleData[0]._id }))
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .take((t) => t.key("MY_KEY").fields("items"))
      .execute()
      `,
    });
    b3.func = () => findBy_id_FIND(b3);
    list.push(b3);
    /* #endregion */

    //------------------------

    /* #region  find by _id */
    const b4 = new BulletLog({
      title: "find by guid (with find by object)",
      description: `
      const response = await createDeclarativeBulletApi()
      .find((el) => el.findByObject({ guid: sampleData[0].guid }))
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .take((t) =>
        t
          .key("MY_KEY_1")
          .addFromInto((ft) => ft.from("age").into("ageProperty"))
          .addFromInto((ft) => ft.from("test").into("testProperty"))
      )
      .execute()
      `,
    });
    b4.func = () => findBy_guid_FIND(b4);
    list.push(b4);
    /* #endregion */

    //------------------------

    /* #region  find multiple consitions (only equality is considered) */
    const b5 = new BulletLog({
      title: "find by multiple conditions",
      description: `
      const response = await createDeclarativeBulletApi()
      .find((el) => el.findByObject({ test: 1, age: 5 }))
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .take((t) => t.exclude("items,test"))
      .execute()
      `,
    });
    b5.func = () => findBy_multiple(b5);
    list.push(b5);
    /* #endregion */

    //------------------------

    /* #region  find multiple consitions (only equality is considered) */
    const b6 = new BulletLog({
      title: "find by expression and sort by multiple fields",
      description: `
      const response = await createDeclarativeBulletApi()
      .find((el) => el.expression("test = 1 && age > 4"))
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND))
      .sort((s) => s.field("age").ascending(true))
      .sort((s) => s.field("categoryName").ascending(fal))
      .execute()
      `,
    });
    b6.func = () => findBy_expression(b6);
    list.push(b6);
    /* #endregion */

    /* #region  find multiple consitions (only equality is considered) */
    const b7 = new BulletLog({
      title: "find by regex",
      description: `
      const response = await createDeclarativeBulletApi()
      .find((el) =>
        el.regex({
          categoryName: "^flo",
        })
      )
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .execute()
      `,
    });
    b7.func = () => findBy_regex(b7);
    list.push(b7);
    /* #endregion */

    /* #region  find multiple consitions (only equality is considered) */
    const b8 = new BulletLog({
      title: "find by a list of values",
      description: `
      const response = await createDeclarativeBulletApi()
      .find((el) => el.in({ age: [5, 6] }))
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND))
      .execute()
      `,
    });
    b8.func = () => findBy_in(b8);
    list.push(b8);
    /* #endregion */

    //------------------------

    /* #region  nested objects */
    const b9 = new BulletLog({
      title: "search into nested objects",
      description: `
      const response = await createDeclarativeBulletApi()
      .find((el) => el.expression("items.id>3"))
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND))
      .sort((s) => s.field("age").ascending(false))
      .sort((s) => s.field("categoryName").ascending(false))
      .execute()
      `,
    });
    b9.func = () => findBy_expression_NESTED_Objects(b9);
    list.push(b9);
    /* #endregion */

    /* #region  nested objects */
    const b10 = new BulletLog({
      title: "pagination",
      description: `
      const response = await createDeclarativeBulletApi()
      .find((el) => el.expression("age>0"))
      .collection((c) =>
        c.name(FIND_COLLECTION).method(BULLET_METHOD.PAGINATION)
      )
      .sort((s) => s.field("age").ascending(false))
      .sort((s) => s.field("categoryName").ascending(false))
      .page((p) => p.itemsOnPage(1).pageNo(1))
      .execute()
      `,
    });
    b10.func = () => paginationExample(b10);
    list.push(b10);
    /* #endregion */

    /* #region  nested objects */
    const b11 = new BulletLog({
      title: "find all",
      description: `
      const response = await createDeclarativeBulletApi()
      .collection((c) =>
        c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND)
      )
      .sort((s) => s.field("age").ascending(false))
      .sort((s) => s.field("categoryName").ascending(false))
      .execute()
      `,
    });
    b11.func = () => findAll(b11);
    list.push(b11);
    /* #endregion */

    //
    store.setEventValues(EVENT_NANME, list, true);
  }, []);

  const checkPrerequisites = async () => {
    let { token } = store.get("BULLET_IO_USER") || {};
    if (!token) {
      token = await loginBulletIO_01();
    }

    const sampleData = getSampleData();
    if (!sampleData) {
      const prereqBulletObject = store.get("FIND_PREREQ");
      if (!prereqBulletObject) {
        throw new Error("no prereqBulletObject");
      }
      await prereqBulletObject?.execute();
    }
  };

  const handleClick = () =>
    helpers.chain1([
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

  /* #region  Prerequisites */
  const insertObjectPrerequisites = async (bulletLog: BulletLog) => {
    //keep is as it is and don't call checkPrerequisites
    let { token } = store.get("BULLET_IO_USER") || {};
    if (!token) {
      token = await loginBulletIO_01();
    }

    const checkIfAlreadyPopulated = await createDeclarativeBulletApi()
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND))
      .execute({});

    if (checkIfAlreadyPopulated.data.length) {
      store.set("FIND_SAMPLE_DATA", checkIfAlreadyPopulated.data);
      //already inserted
      return;
    }

    const guid = utils.createUUID();
    let apiBulletRequest = null;

    const insertResponse = await createDeclarativeBulletApi()
      .body([
        {
          test: 1,
          guid,
          age: 5,
          weight: 500,
          items: [
            {
              id: 1,
              color: "red",
            },
            { id: 2, color: "blue" },
          ],
          categoryName: "flowers",
        },
        {
          test: 2,
          guid: utils.createUUID(),
          age: 6,
          weight: 600,
          items: [
            {
              id: 3,
              color: "yellow",
            },
            { id: 4, color: "magenta" },
          ],
          categoryName: "animals",
        },
      ])
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.INSERT))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    let vRequest = null;
    const findResponse = await createDeclarativeBulletApi()
      .body({ guid })
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          vRequest = apiBulletJSON;
        },
      });

    store.set("FIND_SAMPLE_DATA", findResponse.data);

    const bulletLogVerify: BulletLog = new BulletLog({});
    bulletLogVerify.route = "insert1-verify";
    bulletLogVerify.request = vRequest;
    bulletLogVerify.response = findResponse;

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = insertResponse;
    bulletLog.verify = bulletLogVerify;

    return findResponse.data;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const findBy_id = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    const sampleData = getSampleData();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .body({ _id: sampleData[0]._id })
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .take((t) =>
        t
          .addFromInto((ft) => ft.from("age").into("ageProperty"))
          .addFromInto((ft) => ft.from("test").into("testProperty"))
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const findBy_GuidWithBody = async (bulletLog: BulletLog) => {
    await checkPrerequisites();
    const sampleData = getSampleData();

    if (!sampleData) {
      throw new Error("sampleData[0].guid is not populated");
    }

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .body({ guid: sampleData[0].guid })
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .take((t) => t.fields("age,test"))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const findBy_id_FIND = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    const sampleData = getSampleData();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .find((el) => el.findByObject({ _id: sampleData[0]._id }))
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .take((t) => t.key("MY_KEY").fields("items"))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const findBy_guid_FIND = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    const sampleData = getSampleData();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .find((el) => el.findByObject({ guid: sampleData[0].guid }))
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .take((t) =>
        t
          .key("MY_KEY_1")
          .addFromInto((ft) => ft.from("age").into("ageProperty"))
          .addFromInto((ft) => ft.from("test").into("testProperty"))
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const findBy_multiple = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    // const sampleData = getSampleData();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .find((el) => el.findByObject({ test: 1, age: 5 }))
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .take((t) => t.exclude("items,test"))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const findBy_expression = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    // const sampleData = getSampleData();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .find((el) => el.expression("test = 1 && age > 4"))
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND))
      .sort((s) => s.field("age").ascending(false))
      .sort((s) => s.field("categoryName").ascending(false))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const findBy_regex = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    // const sampleData = getSampleData();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .find((el) =>
        el.regex({
          categoryName: "^flo",
        })
      )
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const findBy_in = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    // const sampleData = getSampleData();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .find((el) => el.in({ age: [5, 6] }))
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const findBy_expression_NESTED_Objects = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    // const sampleData = getSampleData();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .find((el) => el.expression("items.id>3"))
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND))
      .sort((s) => s.field("age").ascending(false))
      .sort((s) => s.field("categoryName").ascending(false))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const paginationExample = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    // const sampleData = getSampleData();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .find((el) => el.expression("age>0"))
      .collection((c) =>
        c.name(FIND_COLLECTION).method(BULLET_METHOD.PAGINATION)
      )
      .sort((s) => s.field("age").ascending(false))
      .sort((s) => s.field("categoryName").ascending(false))
      .page((p) => p.itemsOnPage(1).pageNo(1))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const findAll = async (bulletLog: BulletLog) => {
    let { token } = store.get("BULLET_IO_USER") || {};
    if (!token) {
      token = await loginBulletIO_01();
    }

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  return (
    <>
      {/* <button type="button" onClick={handleClick}>
        execute dd
      </button> */}
      <div>
        <UserPassword></UserPassword>
      </div>
      <div>
        <BulletLogsComponent eventName="LOGS"></BulletLogsComponent>
      </div>
      <BulletLogsComponent eventName={EVENT_NANME}></BulletLogsComponent>
    </>
  );
};
