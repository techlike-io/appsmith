import React from "react";
import styles from "./bar.module.css";

type BarDateHandleProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  barCornerRadius: number;
  onMouseDown: (event: React.MouseEvent<SVGRectElement, MouseEvent>) => void;
};
export const BarDateHandle: React.FC<BarDateHandleProps> = ({
  barCornerRadius,
  height,
  onMouseDown,
  width,
  x,
  y,
}) => {
  return (
    <rect
      className={styles.barHandle}
      height={height}
      onMouseDown={onMouseDown}
      rx={barCornerRadius}
      ry={barCornerRadius}
      width={width}
      x={x}
      y={y}
    />
  );
};
