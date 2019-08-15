import React from "react";
import * as styles from "./overlay.less";

interface OverlayProps {
  onClick?: () => void;
  zIndex: number;
}

export class Overlay extends React.PureComponent<OverlayProps> {
  public render() {
    const { onClick, zIndex } = this.props;
    return <div className={styles.overlay} style={{ zIndex }} onClick={onClick} />;
  }
}
