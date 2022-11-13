import ReactJson from "react-json-view";

export const JsonViewer = (props: any) => {
  return (
    // <pre>
    //   <code>{JSON.stringify(props.props)}</code>
    // </pre>

    <div className="mt5">
      <ReactJson
        src={props.props}
        name={null}
        style={{}}
        enableClipboard={false}
        displayDataTypes={false}
        quotesOnKeys={false}
        displayObjectSize={false}
      />
    </div>
  );
};
