import { useEffect, useState } from "react";
import BulletLog from "../_models/BulletLog";
import observer from "../_observer/observer";
import { store } from "../_store/store";
import { BulletLogComponent } from "./bullet-log-component";
import { JsonViewer } from "./json-viewer";

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { utils } from "../_utils/utils";

export type BulletLogsProps = {
  eventName: string;
};

export const BulletLogsComponent = (props: BulletLogsProps) => {
  const [draw, setDraw] = useState("");
  const [logs, setLogs] = useState<BulletLog[]>(store.get(props.eventName, []));
  const [selected, setSelectedLog] = useState<BulletLog | null>(null);

  const selectLogItem = (item: BulletLog) => {
    logs.forEach((el) => (el.css = ""));
    item.css = "active";
    setSelectedLog(item);
  };

  useEffect(() => {
    observer.subscribe(props.eventName, this, (value: any) => {
      const logs = store.get(props.eventName, []);
      setLogs([...logs]);
    });
    observer.subscribe("LOGS_REDRAW", this, (value: any) => {
      // const logs = store.get(props.eventName, []);
      // setLogs([...logs]);
      setDraw(utils.createUUID());
    });
  }, []);

  return (
    <div className={`flex ${draw}`}>
      <div className="flex1 b">
        <ul className="my">
          {logs.map((bulletLog: BulletLog) => {
            return (
              <li key={bulletLog.guid} onClick={() => selectLogItem(bulletLog)}>
                <BulletLogComponent bulletLog={bulletLog}></BulletLogComponent>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="ml5  flex flex1 center-h b">
        {selected && (
          <div>
            <div>
              <span>{selected.title}</span>

              {selected.execute && (
                <button
                  className="ml5"
                  type="button"
                  onClick={selected.execute}
                >
                  execute
                </button>
              )}
            </div>

            <div className="code">
              <SyntaxHighlighter language="javascript" style={docco}>
                {selected.description || "rrr"}
              </SyntaxHighlighter>
            </div>

            <div className="flex">
              <div className="flex flex-column center-vertical">
                {/* <span>{selected.route}</span> */}
                <label>Request</label>
                <JsonViewer props={selected.request}></JsonViewer>

                <label>Response</label>
                <JsonViewer props={selected.response}></JsonViewer>
              </div>

              {selected.verify && (
                <div className="flex flex-column center-vertical">
                  <label>Verify Request</label>
                  <JsonViewer props={selected.verify.request}></JsonViewer>

                  <label>Verify Response</label>
                  <JsonViewer props={selected.verify.response}></JsonViewer>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
