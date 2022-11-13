import { BULLET_METHOD } from "declarative-fluent-bullet-api/fluent/constants";
import { useEffect } from "react";
import {
  createDeclarativeBulletApi,
  loginBulletIO_01,
} from "../_factory/prerequisites";
import { store } from "../_store/store";
import { BulletLogsComponent } from "../_components/bullet-logs-component";
import BulletLog from "../_models/BulletLog";
import { UserPassword } from "../user/user-password";

export const DemoLog = () => {
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
      title: "log events into a user collection",
      description: `
     
      `,
    });
    b1.func = () => log1(b1);
    list.push(b1);
    /* #endregion */

    /* #region  log 1 */
    const b2 = new BulletLog({
      title: "log events by calling a user specific server",
      description: `
      // 1. configure the logServerUrl (on the bullet key)
      // 2. pass the log.route parameter
      `,
    });
    b2.func = () => log2(b2);
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
  const log1 = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .collection((c) => c.name("log_example").method(BULLET_METHOD.INSERT))
      .body({ testLog: 1 })
      .log((l) => l.collection("my_logs"))
      .execute({
        beforeSendingRequest: (apiBulletJSON: any) => {
          apiBulletRequest = apiBulletJSON;
        },
      });

    bulletLog.route = "join 1 on 1";
    bulletLog.request = apiBulletRequest;
    bulletLog.response = response;
  };
  /* #endregion */

  /* #region  Find By _id from body */
  const log2 = async (bulletLog: BulletLog) => {
    await checkPrerequisites();

    let apiBulletRequest = null;

    const response = await createDeclarativeBulletApi()
      .collection((c) => c.name("log_example").method(BULLET_METHOD.INSERT))
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
