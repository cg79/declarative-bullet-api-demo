import { BULLET_METHOD } from "declarative-fluent-bullet-api/fluent/constants";

import { useEffect } from "react";
import {
  createDeclarativeBulletApi,
  createBulletHttpRequestLibrary,
  loginBulletIO_01,
} from "../_factory/prerequisites";
import { store } from "../_store/store";
import { BulletLogsComponent } from "../_components/bullet-logs-component";
import BulletLog from "../_models/BulletLog";
import { utils } from "../_utils/utils";
import { UserPassword } from "../user/user-password";

export const DemoSecurity = () => {
  // const handleClick = () => inserDemo1();

  const EVENT_NANME = "JOIN";

  const checkPrerequisites = async () => {
    let { token } = store.get("BULLET_IO_USER") || {};
    if (!token) {
      token = await loginBulletIO_01();
    }
  };

  useEffect(() => {
    const list: any[] = [];

    /* #region  log 1 */
    const b1 = new BulletLog({
      title: "insert throws error if name is not provided",
      description: `
     
      `,
    });
    b1.func = () => schemaValidation(b1);
    list.push(b1);
    /* #endregion */

    /* #region  log 1 */
    const b2 = new BulletLog({
      title:
        "user not allowed to insert into a non existent collection because has no permission for 'create_collection' ",
      description: `
      // 1. configure the logServerUrl (on the bullet key)
      // 2. pass the log.route parameter
      `,
    });
    b2.func = () => stopInsert(b2);
    list.push(b2);
    /* #endregion */

    /* #region  log after */
    const b3 = new BulletLog({
      title: "log events by calling a user specific server",
      description: `
      // 1. configure the logServerUrl (on the bullet key)
      // 2. pass the log.route parameter
      `,
    });
    b3.func = () => logTrigger(b3);
    list.push(b3);
    /* #endregion */

    //
    store.setEventValues(EVENT_NANME, list, true);
  }, []);

  /* #region  Find By _id from body */
  const schemaValidation = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .collection((c) => c.name("schema1").method(BULLET_METHOD.INSERT))
      .body({ testSchemaValidation: 1 })
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "testSchema Validation";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const stopInsert = async (bulletLog: BulletLog) => {
    const email = "testinsertwithnocreatecollectionpermission@a1.com";
    const password = "password";
    const x = createBulletHttpRequestLibrary();

    let loginResponse = await x.createuserandlogin({
      email,
      password,
      security: 2,
    });

    if (loginResponse?.message === "EMAIL_ALREADY_EXISTS") {
      loginResponse = await x.login({
        email,
        password,
      });
    }

    if (!loginResponse.success) {
      throw new Error(
        "could not login the user. please edit the above user email"
      );
    }

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi(loginResponse.data.token)
      .collection((c) =>
        c.name(utils.createUUID()).method(BULLET_METHOD.INSERT)
      )
      .body({ testLog: 1 })
      .log((l) => l.route("logs"))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "logs";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const logTrigger = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .collection((c) => c.name("log_example").method(BULLET_METHOD.INSERT))
      .body({ testLog: 1 })
      .log((l) => l.collection("my_logs"))
      .trigger((t) => t.route("afterinsert"))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route =
      "call a api post, containing the  inserted object on the personalServerUrl/{route}";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
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
      {/* <button type="button" onClick={handleClick}>
        execute
      </button> */}
      <BulletLogsComponent eventName={EVENT_NANME}></BulletLogsComponent>
    </>
  );
};
