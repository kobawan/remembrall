import React from "react";
import * as styles from "./loading.less";

import { spinnerSvg } from "../Svg/Svg";

export const Loading = React.memo(() => {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}>
        {spinnerSvg}
      </div>
    </div>
  );
});
