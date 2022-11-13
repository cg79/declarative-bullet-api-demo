import { store } from "../_store/store";
import { utils } from "../_utils/utils";

class BulletLog {
  guid = "";
  request: any = null;
  route = "";

  response: any = null;

  css = "";

  title = "";

  description = "";

  verify: BulletLog | null = null;

  func?: Function;

  constructor(obj: {
    title?: string;
    description?: string;
    func?: Function;
    request?: any;
    response?: any;
  }) {
    this.title = obj.title || "";
    this.request = obj.request;
    this.response = obj.response;
    this.description = obj.description || "";
    this.func = obj.func;
    this.guid = utils.createUUID();
  }

  execute = async () => {
    if (!this.func) {
      return;
    }
    // if (this.context) {
    //
    //   return this.func.apply(this.context).finally(() => {
    //     this.guid = utils.createUUID();
    //     store.publish("LOGS_REDRAW");
    //   });
    // }
    const resp = await this.func();
    this.guid = utils.createUUID();
    store.publish("LOGS_REDRAW");
    // .then((value: any) => {
    //   this.response = value;
    // })
    // .catch((ex: any) => {
    //   this.response = ex;
    // })
    // .finally(() => {
    //   this.guid = utils.createUUID();
    //   store.publish("LOGS_REDRAW");
    // });
  };
}

export default BulletLog;
