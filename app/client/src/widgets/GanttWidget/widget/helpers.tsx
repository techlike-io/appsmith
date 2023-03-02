import { JSONFormWidgetProps } from "widgets/JSONFormWidget/widget";
import { Task } from "../types/public-types";
import moment from "moment";

export function getDependentTaskIds(tasks: Task[], taskId: string): string[] {
  const dependentTaskIds = new Set<string>();

  const task = tasks.find((t) => t.id === taskId);
  if (!task || !task.dependencies) {
    return Array.from(dependentTaskIds);
  }

  if (task.type === "project") {
    return tasks.filter((t) => t.project === task.id).map((t) => t.id);
  }

  task.dependencies.forEach((dependencyId) => {
    const dependentTask = tasks.find((t) => t.id === dependencyId);
    if (dependentTask) {
      dependentTaskIds.add(dependencyId);
      const dependentDependentTaskIds = getDependentTaskIds(
        tasks,
        dependencyId,
      );
      dependentDependentTaskIds.forEach((id) => dependentTaskIds.add(id));
    }
  });

  return Array.from(dependentTaskIds);
}

export const calculateProgress = (task: Task) => {
  // calculate progress as a moment in time between start date and end date in comparison to current date
  const now = new Date();
  const start = new Date(task.start);
  const end = new Date(task.end);
  const duration = end.getTime() - start.getTime();
  const current = now.getTime() - start.getTime();

  //return % capped at 0 or 100
  if (current <= 0) return 0;
  if (current >= duration) return 100;
  return Math.round((current / duration) * 100);
};

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
