import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./home";
import Layout from "./layout";
import { DemoInsert } from "./demo/demo-insert";
import NoPage from "./no-page";
import { BulletLogsComponent } from "./_components/bullet-logs-component";
import { DemoInsertFiles } from "./demo/demo-insert-files";
import { DemoFind } from "./demo/demo-find";
import { DemoUpdate } from "./demo/demo-update";
import { DemoFlow } from "./demo/demo-flow";
import { DemoDelete } from "./demo/demo-delete";
import { DemoJoin } from "./demo/demo-join";
import { DemoLog } from "./demo/demo-log";
import { DemoSecurity } from "./demo/demo-security";

function App() {
  // useEffect(() => {
  //   prerequisites({
  //     login: "claudiu9379@yahoo.com.com",
  //     password: "a1",
  //   });
  // }, []);

  // const handleClick = () => {

  //   prerequisites({
  //     login: "claudiu9379@yahoo.com",
  //     password: "a1",
  //   });
  // };

  return (
    <div>
      {/* <button type="button" onClick={handleClick}>
        execute prerequisites
      </button> */}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="insert" element={<DemoInsert />} />
            <Route path="insert-files" element={<DemoInsertFiles />} />
            <Route path="find" element={<DemoFind />} />
            <Route path="join" element={<DemoJoin />} />
            <Route path="update" element={<DemoUpdate />} />
            <Route path="delete" element={<DemoDelete />} />
            <Route path="flow" element={<DemoFlow />} />
            <Route path="log" element={<DemoLog />} />
            <Route path="security" element={<DemoSecurity />} />

            {/* <Route path="contact" element={<Contact />} /> */}
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <BulletLogsComponent eventName="LOGS"></BulletLogsComponent>
    </div>
  );
}

export default App;
