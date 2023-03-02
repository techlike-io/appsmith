import React, { useMemo } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";

const localeDateStringCache: {
  [key: string]: string;
} = {};

const toLocaleDateStringFactory = (locale: string) => (
  date: Date,
  dateTimeOptions: Intl.DateTimeFormatOptions,
) => {
  const key = date.toString();
  let lds = localeDateStringCache[key];
  if (!lds) {
    lds = date.toLocaleDateString(locale, dateTimeOptions);
    localeDateStringCache[key] = lds;
  }
  return lds;
};
const dateTimeOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
  onTaskOnListClick: (task: Task) => void;
}> = ({
  fontFamily,
  fontSize,
  locale,
  onExpanderClick,
  onTaskOnListClick,
  rowHeight,
  rowWidth,
  tasks,
}) => {
  const toLocaleDateString = useMemo(() => toLocaleDateStringFactory(locale), [
    locale,
  ]);

  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map((t) => {
        let expanderSymbol = "";
        if (t.hideChildren === false) {
          expanderSymbol = "▼";
        } else if (t.hideChildren === true) {
          expanderSymbol = "▶";
        }

        let textClassName = "";

        if (t.type === "task") {
          if (t.group) {
            textClassName = styles.subtaskLabel;
          } else {
            textClassName = styles.taskLabel;
          }
        }

        if (t.type === "group") {
          textClassName = styles.groupLabel;
        }

        return (
          <div
            className={styles.taskListTableRow}
            key={`${t.id}row`}
            style={{ height: rowHeight }}
          >
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
              title={t.name}
            >
              <div
                className={styles.taskListNameWrapper}
                onClick={() => {
                  console.log("");
                }}
              >
                <div
                  className={
                    expanderSymbol
                      ? t.type === "group"
                        ? styles.groupListExpander
                        : styles.taskListExpander
                      : styles.taskListEmptyExpander
                  }
                  onClick={() => onExpanderClick(t)}
                >
                  {expanderSymbol}
                </div>
                <div className={textClassName}>{t.name}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
