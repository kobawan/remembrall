import React from "react";
import * as styles from "./overlay.less";

interface OverlayProps {
  onClick?: () => void;
  zIndex: number;
}

export const Overlay: React.FC<OverlayProps> = ({
  onClick,
  zIndex,
}) => {
  return (
    <div
      className={styles.overlay}
      style={{ zIndex }}
      onClick={onClick}
    />
  );
};
