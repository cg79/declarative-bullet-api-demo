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

export const DemoUpdate = () => {
  // const handleClick = () => inserDemo1();

  const EVENT_NANME = "UPDATE";
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
      title: "update by _id (from body)",
      description: `
      const response = await createDeclarativeBulletApi()
      .body({ _id: sampleData[0]._id, newName: "newName", myDate: new Date() })
      .collection((c) =>
        c.name(FIND_COLLECTION).method(BULLET_METHOD.UPDATE_ONE)
      )
      .execute()
      `,
    });
    b1.func = () => updateBy_id(b1);
    list.push(b1);
    /* #endregion */

    //------------------------

    /* #region  find by guid (from body) */
    const b2 = new BulletLog({
      title: `update by guid (from body) - increment age by 1
        + add a new element into nested items array
      `,
      description: `
      const response = await createDeclarativeBulletApi()
      .body({
        guid: sampleData[0].guid,
        version: 2,
        inc: { age: 1 },
        push: {
          items: { newItem: true },
        },
      })
      .collection((c) =>
        c.name(FIND_COLLECTION).method(BULLET_METHOD.UPDATE_ONE)
      )
      .execute()
      `,
    });
    b2.func = () => updateBy_GuidWithBody(b2);

    list.push(b2);
    /* #endregion */

    //------------------------

    /* #region  find by _id */
    const b3 = new BulletLog({
      title: "remove item from nested collection",
      description: `
      cconst response = await createDeclarativeBulletApi()
      .body({
        guid: sampleData[0].guid,
        pull: {
          items: { newItem: true },
        },
      })
      .collection((c) =>
        c.name(FIND_COLLECTION).method(BULLET_METHOD.UPDATE_ONE)
      )
      .execute()
      `,
    });
    b3.func = () => updateBy_GuidWithBodyRemoveFromNestedCollection(b3);
    list.push(b3);
    /* #endregion */

    //------------------------

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
      //already inserted
      store.set("FIND_SAMPLE_DATA", checkIfAlreadyPopulated.data);
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
  const updateBy_id = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    const sampleData = getSampleData();

    if (!sampleData) {
      bulletLog.response = {
        error: "no sample data",
      };
      return;
    }

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .body({ _id: sampleData[0]._id, newName: "newName", myDate: new Date() })
      .collection((c) =>
        c.name(FIND_COLLECTION).method(BULLET_METHOD.UPDATE_ONE)
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
  const updateBy_GuidWithBody = async (bulletLog: BulletLog) => {
    await checkPrerequisites();
    const sampleData = getSampleData();

    if (!sampleData[0].guid) {
      throw new Error("sampleData[0].guid is not populated");
    }

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .body({
        guid: sampleData[0].guid,
        version: 2,
        inc: { age: 1 },
        push: {
          items: { newItem: true },
        },
      })
      .collection((c) =>
        c.name(FIND_COLLECTION).method(BULLET_METHOD.UPDATE_ONE)
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;

    let vRequest = null;
    const findResponse = await createDeclarativeBulletApi()
      .body({ guid: sampleData[0].guid })
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          vRequest = apiBulletJSON;
        },
      });

    const bulletLogVerify: BulletLog = new BulletLog({});
    bulletLogVerify.route = "insert1-verify";
    bulletLogVerify.request = vRequest;
    bulletLogVerify.response = findResponse;

    bulletLog.verify = bulletLogVerify;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const updateBy_GuidWithBodyRemoveFromNestedCollection = async (
    bulletLog: BulletLog
  ) => {
    await checkPrerequisites();
    const sampleData = getSampleData();

    if (!sampleData[0].guid) {
      throw new Error("sampleData[0].guid is not populated");
    }

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .body({
        guid: sampleData[0].guid,
        pull: {
          items: { newItem: true },
        },
      })
      .collection((c) =>
        c.name(FIND_COLLECTION).method(BULLET_METHOD.UPDATE_ONE)
      )
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "insert1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;

    let vRequest = null;
    const findResponse = await createDeclarativeBulletApi()
      .body({ guid: sampleData[0].guid })
      .collection((c) => c.name(FIND_COLLECTION).method(BULLET_METHOD.FIND_ONE))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          vRequest = apiBulletJSON;
        },
      });

    const bulletLogVerify: BulletLog = new BulletLog({});
    bulletLogVerify.route = "insert1-verify";
    bulletLogVerify.request = vRequest;
    bulletLogVerify.response = findResponse;

    bulletLog.verify = bulletLogVerify;
  };
  /* #endregion */

  return (
    <>
      <div>
        <UserPassword></UserPassword>
      </div>
      <div>
        <BulletLogsComponent eventName="LOGS"></BulletLogsComponent>
      </div>
      <div>NOTE: all the find criterias can be also applied to update</div>
      {/* <button type="button" onClick={handleClick}>
        execute
      </button> */}
      <BulletLogsComponent eventName={EVENT_NANME}></BulletLogsComponent>
    </>
  );
};
