import React from "react";
import style from "./bar.module.css";

type BarDisplayProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  /* progress start point */
  progressX: number;
  progressWidth: number;
  barCornerRadius: number;
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
  };
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
};
export const BarDisplay: React.FC<BarDisplayProps> = ({
  barCornerRadius,
  height,
  isSelected,
  onMouseDown,
  progressWidth,
  progressX,
  styles,
  width,
  x,
  y,
}) => {
  const getProcessColor = () => {
    return isSelected ? styles.progressSelectedColor : styles.progressColor;
  };

  const getBarColor = () => {
    return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };

  return (
    <g onMouseDown={onMouseDown}>
      <rect
        className={style.barBackground}
        fill={getBarColor()}
        height={height}
        rx={barCornerRadius}
        ry={barCornerRadius}
        width={width}
        x={x}
        y={y}
      />
      <rect
        fill={getProcessColor()}
        height={height}
        rx={barCornerRadius}
        ry={barCornerRadius}
        width={progressWidth}
        x={progressX}
        y={y}
      />
    </g>
  );
};
