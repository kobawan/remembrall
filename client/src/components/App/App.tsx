import React, { useState, useCallback } from "react";
import * as styles from "./app.less";

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
    <div className={styles.app}>
      <div className={styles.header}>
        <div className={styles.title}>Remembrall</div>
        {userHasLoggedIn && (
          <button onClick={logout} className={styles.logout}>
            {exitSvg}
          </button>
        )}
      </div>
      {!userHasLoggedIn && <hr className="hr" />}
      {userHasLoggedIn
        ? <ColumnsManager />
        : <Login updateLoginState={toggleUserLogin}/>
      }
    </div>
  );
});
