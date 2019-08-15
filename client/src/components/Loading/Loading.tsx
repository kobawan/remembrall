import * as React from "react";
import "./loading.less";

import { spinnerSvg } from "../Svg/Svg";

export const Loading = React.memo(() => {
  return (
    <div className="loading">
      {spinnerSvg}
    </div>
  );
});
