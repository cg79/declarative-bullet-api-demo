import { useEffect, useState } from "react";
import { loginBulletIO_01 } from "../_factory/prerequisites";
import { store } from "../_store/store";

export const UserPassword = () => {
  const [isLogged, setIsLogged] = useState(false);
  const setBulletKey = (event: any) =>
    store.set("BULLET_KEY", event.target.value);
  const setUserName = (event: any) => store.set("USERNAME", event.target.value);
  const setUserPassword = (event: any) =>
    store.set("PASSWORD", event.target.value);

  const callLoginMethod = () => {
    loginBulletIO_01().then((v) => {
      debugger;
      setIsLogged(true);
    });
  };

  useEffect(() => {
    const logged = store.get("BULLET_IO_USER");
    if (logged) {
      setIsLogged(true);
    }
  }, []);

  return !isLogged ? (
    <div className="flex flex-column center-v">
      enter the bullet key (from dashboard) email address and password
      <label htmlFor="inp" className="inp">
        <input
          type="text"
          id="bulletkey"
          placeholder="&nbsp;"
          onChange={setBulletKey}
        />
        <span className="label">Bullet key...</span>
        <span className="focus-bg"></span>
      </label>
      <label htmlFor="inp" className="inp">
        <input
          type="text"
          id="username"
          placeholder="&nbsp;"
          onChange={setUserName}
        />
        <span className="label">Email...</span>
        <span className="focus-bg"></span>
      </label>
      <label htmlFor="inp" className="inp">
        <input
          type="password"
          id="password"
          placeholder="&nbsp;"
          onChange={setUserPassword}
        />
        <span className="label">Password...</span>
        <span className="focus-bg"></span>
      </label>
      <button
        className="ml5 mt5"
        type="button"
        onClick={() => callLoginMethod()}
      >
        Login
      </button>
    </div>
  ) : null;
};
