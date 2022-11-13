import BulletLog from "../_models/BulletLog";

export type BulletLogProps = {
  bulletLog: BulletLog;
};

export const BulletLogComponent = (props: BulletLogProps) => {
  return (
    <div className="flex">
      <div className={`mt1 ${props.bulletLog.css}`}>
        <span>{props.bulletLog.title}</span>
      </div>
      {/* <div>
        <JsonViewer props={props.bulletLog.request}></JsonViewer>
        <JsonViewer props={props.bulletLog.response}></JsonViewer>
      </div> */}
      {/* <button type="button">{props.bulletLog.route}</button>); */}
    </div>
  );
};
