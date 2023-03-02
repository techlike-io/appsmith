import React, { useRef, useEffect, useState } from "react";
import { Task } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
import styles from "./tooltip.module.css";

export type TooltipProps = {
  task: BarTask;
  arrowIndent: number;
  rtl: boolean;
  svgContainerHeight: number;
  svgContainerWidth: number;
  svgWidth: number;
  headerHeight: number;
  taskListWidth: number;
  scrollX: number;
  scrollY: number;
  rowHeight: number;
  fontSize: string;
  fontFamily: string;
  TooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
};
export const Tooltip: React.FC<TooltipProps> = ({
  arrowIndent,
  fontFamily,
  fontSize,
  headerHeight,
  rowHeight,
  rtl,
  scrollX,
  scrollY,
  svgContainerHeight,
  svgContainerWidth,
  task,
  taskListWidth,
  TooltipContent,
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [relatedY, setRelatedY] = useState(0);
  const [relatedX, setRelatedX] = useState(0);
  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
      const tooltipWidth = tooltipRef.current.offsetWidth * 1.1;

      let newRelatedY = task.index * rowHeight - scrollY + headerHeight;
      let newRelatedX: number;
      if (rtl) {
        newRelatedX = task.x1 - arrowIndent * 1.5 - tooltipWidth - scrollX;
        if (newRelatedX < 0) {
          newRelatedX = task.x2 + arrowIndent * 1.5 - scrollX;
        }
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        if (tooltipLeftmostPoint > svgContainerWidth) {
          newRelatedX = svgContainerWidth - tooltipWidth;
          newRelatedY += rowHeight;
        }
      } else {
        newRelatedX = task.x2 + arrowIndent * 1.5 + taskListWidth - scrollX;
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        const fullChartWidth = taskListWidth + svgContainerWidth;
        if (tooltipLeftmostPoint > fullChartWidth) {
          newRelatedX =
            task.x1 +
            taskListWidth -
            arrowIndent * 1.5 -
            scrollX -
            tooltipWidth;
        }
        if (newRelatedX < taskListWidth) {
          newRelatedX = svgContainerWidth + taskListWidth - tooltipWidth;
          newRelatedY += rowHeight;
        }
      }

      const tooltipLowerPoint = tooltipHeight + newRelatedY - scrollY;
      if (tooltipLowerPoint > svgContainerHeight - scrollY) {
        newRelatedY = svgContainerHeight - tooltipHeight;
      }
      setRelatedY(newRelatedY);
      setRelatedX(newRelatedX);
    }
  }, [
    tooltipRef,
    task,
    arrowIndent,
    scrollX,
    scrollY,
    headerHeight,
    taskListWidth,
    rowHeight,
    svgContainerHeight,
    svgContainerWidth,
    rtl,
  ]);

  return (
    <div
      className={
        relatedX
          ? styles.tooltipDetailsContainer
          : styles.tooltipDetailsContainerHidden
      }
      ref={tooltipRef}
      style={{ left: relatedX, top: relatedY }}
    >
      <TooltipContent fontFamily={fontFamily} fontSize={fontSize} task={task} />
    </div>
  );
};

export const StandardTooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ fontFamily, fontSize, task }) => {
  const style = {
    fontSize,
    fontFamily,
  };

  let status = "Planowane";

  switch (task.status) {
    case "inProgress":
      status = "W realizacji -";
      break;
    case "completed":
      status = "Zrealizowane";
      break;
  }

  return (
    <div className={styles.tooltipDefaultContainer} style={style}>
      <b style={{ fontSize: fontSize + 6 }}>{`${
        task.name
      }: ${task.start.getDate()}.${task.start.getMonth() +
        1}.${task.start.getFullYear()} - ${task.end.getDate()}.${task.end.getMonth() +
        1}.${task.end.getFullYear()}`}</b>
      {task.end.getTime() - task.start.getTime() !== 0 && (
        <p
          className={styles.tooltipDefaultContainerParagraph}
        >{`Czas trwania: ${~~(
          (task.end.getTime() - task.start.getTime()) /
          (1000 * 60 * 60 * 24)
        )} dni`}</p>
      )}

      <p className={styles.tooltipDefaultContainerParagraph}>
        {`Status: ${status} ${
          task.status === "inProgress" ? `${task.progress}%` : ""
        }`}
      </p>
      <p className={styles.tooltipDefaultContainerParagraph}>
        {task.assignees &&
          task.assignees?.length > 0 &&
          `Zaangażowani: ${task.assignees?.join(", ")}`}
      </p>
      <p className={styles.tooltipDefaultContainerParagraph}>
        {!!task.place && `Miejsce: ${task.place}`}
      </p>
      {!!task.actions && (
        <p className={styles.tooltipDefaultContainerParagraph}>
          {`Działania: ${task.actions}`}
        </p>
      )}
      {!!task.comments && (
        <p className={styles.tooltipDefaultContainerParagraph}>
          {`Komentarz: ${task.comments}`}
        </p>
      )}
    </div>
  );
};
