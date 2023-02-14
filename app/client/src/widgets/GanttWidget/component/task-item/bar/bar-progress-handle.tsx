import React from "react";
import styles from "./bar.module.css";

type BarProgressHandleProps = {
  progressPoint: string;
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
};
export const BarProgressHandle: React.FC<BarProgressHandleProps> = ({
  onMouseDown,
  progressPoint,
}) => {
  return (
    <polygon
      className={styles.barHandle}
      onMouseDown={onMouseDown}
      points={progressPoint}
    />
  );
};
