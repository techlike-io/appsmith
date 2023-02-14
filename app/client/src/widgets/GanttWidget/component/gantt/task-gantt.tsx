import React, { useRef, useEffect } from "react";
import { GridProps, Grid } from "../grid/grid";
import { CalendarProps, Calendar } from "../calendar/calendar";
import { TaskGanttContentProps, TaskGanttContent } from "./task-gantt-content";
import styles from "./gantt.module.css";

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  scrollY: number;
  scrollX: number;
};
export const TaskGantt: React.FC<TaskGanttProps> = ({
  barProps,
  calendarProps,
  ganttHeight,
  gridProps,
  scrollX,
  scrollY,
}) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };

  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  useEffect(() => {
    if (verticalGanttContainerRef.current) {
      verticalGanttContainerRef.current.scrollLeft = scrollX;
    }
  }, [scrollX]);

  return (
    <div
      className={styles.ganttVerticalContainer}
      dir="ltr"
      ref={verticalGanttContainerRef}
    >
      <svg
        fontFamily={barProps.fontFamily}
        height={calendarProps.headerHeight}
        width={gridProps.svgWidth}
        xmlns="http://www.w3.org/2000/svg"
      >
        <Calendar {...calendarProps} />
      </svg>
      <div
        className={styles.horizontalContainer}
        ref={horizontalContainerRef}
        style={
          ganttHeight
            ? { height: ganttHeight, width: gridProps.svgWidth }
            : { width: gridProps.svgWidth }
        }
      >
        <svg
          fontFamily={barProps.fontFamily}
          height={barProps.rowHeight * barProps.tasks.length}
          ref={ganttSVGRef}
          width={gridProps.svgWidth}
          xmlns="http://www.w3.org/2000/svg"
        >
          <Grid {...gridProps} />
          <TaskGanttContent {...newBarProps} />
        </svg>
      </div>
    </div>
  );
};
