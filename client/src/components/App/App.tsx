import React, { useState, useCallback } from "react";
import "./app.less";

import { ColumnsManager } from "../ColumnsManager/ColumnsManager";
import { Login } from "../Login/Login";
import { getStorageKey, StorageKeys, clearStorageKey } from "../../utils/localStorage";
import { exitSvg } from "../Svg/Svg";

const logout = () => {
  clearStorageKey(StorageKeys.UserId);
  window.location.reload();
};

export const App = React.memo(() => {
  const [ userHasLoggedIn, setUserHasLoggedIn ] = useState(!!getStorageKey(StorageKeys.UserId));

  const toggleUserLogin = useCallback(() => setUserHasLoggedIn(!userHasLoggedIn), [userHasLoggedIn]);

  return (
    <div className="app">
      <div className="header">
        <div className="title">Remembrall</div>
        {userHasLoggedIn && (
          <button onClick={logout} className="logout">
            {exitSvg}
          </button>
        )}
      </div>
      {!userHasLoggedIn && <hr />}
      {userHasLoggedIn
        ? <ColumnsManager />
        : <Login updateLoginState={toggleUserLogin}/>
      }
    </div>
  );
});
