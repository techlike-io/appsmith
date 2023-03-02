import React from "react";
import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarProgressHandle } from "./bar-progress-handle";
import { TaskItemProps } from "../task-item";
import styles from "./bar.module.css";

export const BarSmall: React.FC<TaskItemProps> = ({
  isDateChangeable,
  isProgressChangeable,
  isSelected,
  onEventStart,
  task,
}) => {
  const progressPoint = getProgressPoint(
    task.progressWidth + task.x1,
    task.y,
    task.height,
  );

  let color = "#b8c2cc";
  let progress = "0";

  switch (task.status) {
    case "completed":
      color = "#7db59a";
      progress = "0";
      break;
    case "inProgress":
      color = "#bcbcff";
      progress = progressPoint;
      break;
  }

  return (
    <g className={styles.barWrapper} tabIndex={0}>
      <BarDisplay
        barCornerRadius={task.barCornerRadius}
        height={task.height}
        isSelected={isSelected}
        onMouseDown={(e) => {
          isDateChangeable && onEventStart("move", task, e);
        }}
        progressWidth={task.progressWidth}
        progressX={task.progressX}
        styles={{
          ...task.styles,
          backgroundColor: color,
        }}
        width={task.x2 - task.x1}
        x={task.x1}
        y={task.y}
      />
      <g className="handleGroup">
        {isProgressChangeable && (
          <BarProgressHandle
            onMouseDown={(e) => {
              onEventStart("progress", task, e);
            }}
            progressPoint={progressPoint}
          />
        )}
      </g>
    </g>
  );
};
