import { JSONFormWidgetProps } from "widgets/JSONFormWidget/widget";
import { Task } from "../types/public-types";

export const taskValidationFn = (
  value: any,
  props: JSONFormWidgetProps,
  _?: any,
) => {
  try {
    const parsedValue = typeof value === "object" ? value : JSON.parse(value);

    if (parsedValue && typeof parsedValue === "object") {
      const tasks: Task[] = parsedValue.map((task: Task) => {
        if (!task.start || !task.end || !task.name || !task.id || !task.type) {
          throw new Error(
            "All task properties are required: start, end, name, id, type",
          );
        }
        if (!(task.start instanceof Date)) {
          task.start = new Date(task.start);
        }
        if (!(task.end instanceof Date)) {
          task.end = new Date(task.end);
        }
        if (task.progress === undefined) {
          task.progress = 0;
        }
        if (task.isDisabled === undefined) {
          task.isDisabled = false;
        }
        if (
          task.type !== "project" &&
          task.type !== "task" &&
          task.type !== "milestone"
        ) {
          throw new Error("Invalid task type: " + task.type);
        }
        return task;
      });
      return {
        isValid: true,
        parsed: tasks,
      };
    }
  } catch (e) {
    return {
      isValid: false,
      parsed: [],
      messages: [(e as Error).message],
    };
  }
  return {
    isValid: false,
    parsed: [],
    messages: [],
  };
};
