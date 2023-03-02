import { useMemo } from "react";
import { Task } from "widgets/GanttWidget/types/public-types";
import { calculateProgress } from "widgets/GanttWidget/widget/helpers";

const extractProjects = (tasks: Task[], hiddenProjects: string[]) => {
  const projectMap = new Map<
    string,
    { projectTask: Task; tasks: Task[]; groups: Task[] }
  >();

  tasks.forEach((data) => {
    if (data.project === undefined) {
      return;
    }
    if (!projectMap.has(data.project)) {
      projectMap.set(data.project, {
        projectTask: {
          name: data.project,
          id: data.project,
          start: data.start,
          end: data.end,
          progress: 50,
          type: "project",
          hideChildren: hiddenProjects.includes(data.project),
          displayOrder: 0,
        },
        tasks: [data],
        groups: [],
      });
    } else {
      const project = projectMap.get(data.project);
      if (project === undefined) {
        return;
      }
      project.projectTask.start =
        project.projectTask.start < data.start
          ? project.projectTask.start
          : data.start;
      project.projectTask.end =
        project.projectTask.end > data.end ? project.projectTask.end : data.end;

      let progress = 0;

      switch (data.status) {
        case "inProgress":
          progress = calculateProgress(data);
          break;
        case "completed":
          progress = 0;
          break;
        case "planned":
          progress = 0;
          break;
      }
      const task = {
        ...data,
        duration: Math.round(
          (data.end.getTime() - data.start.getTime()) / (1000 * 60 * 60 * 24),
        ),
        progress: progress,
      };
      project.tasks.push(task);
    }
  });

  projectMap.forEach((project) => {
    //calculate project progress number of completed tasks / total tasks. Consider in progress tasks as completed in % of their progress
    const completedTasks = project.tasks.filter(
      (task) => task.status === "completed",
    );
    const inProgressTasks = project.tasks.filter(
      (task) => task.status === "inProgress",
    );
    const totalTasks = project.tasks.length;
    const totalTasksCount = totalTasks;
    const completedTasksProgress = completedTasks.length;
    const inProgressTaskProgress = inProgressTasks.reduce(
      (acc, task) => acc + task.progress / 100,
      0,
    );
    const totalProgress = Math.round(
      ((completedTasksProgress + inProgressTaskProgress) / totalTasksCount) *
        100,
    );
    project.projectTask.progress = totalProgress;

    const groups = extractGroups(project, hiddenProjects);
    const groupTasks = Array.from(groups.values());
    const tasksWithoutGroup = project.tasks.filter(
      (task) => task.group === undefined || task.group === "",
    );

    const rootTasks = [
      ...tasksWithoutGroup,
      ...groupTasks.map((group) => group.groupTask),
    ];

    // project tasks are rootTasks sorted by startDate
    const finalTasks = rootTasks
      .sort((a, b) => {
        return a.start.getTime() - b.start.getTime();
      })
      .flatMap((task) => {
        if (task.type === "group") {
          const group = groups.get(task.name);
          if (group === undefined) {
            return [];
          }
          const groupTasks = group.tasks.sort((a, b) => {
            return a.start.getTime() - b.start.getTime();
          });
          return [task, ...groupTasks];
        } else {
          return [task];
        }
      });

    project.tasks = finalTasks;

    project.groups = groupTasks.map((group) => group.groupTask);
    // project.tasks.push(...groupTasks.tasks);
  });

  // create tasks from groups with all dependencies

  return projectMap;
};

function extractGroups(
  project: {
    projectTask: Task;
    tasks: Task[];
    groups: Task[];
  },
  hiddenProjects: string[],
) {
  const groups = new Map<string, { groupTask: Task; tasks: Task[] }>();
  project.tasks.forEach((task) => {
    if (task.group === undefined || task.group === "") {
      return;
    }
    const hide = hiddenProjects.includes(`${task.project}_${task.group}_group`);
    if (!groups.has(task.group)) {
      const groupTask: Task = {
        name: task.group,
        id: `${task.project}_${task.group}_group`,
        start: task.start,
        end: task.end,
        progress: 50,
        project: task.project,
        type: "group",
        hideChildren: hide,
        displayOrder: 0,
        // duration is calculated in days as a difference between start and end dates
      };
      groups.set(task.group, {
        groupTask: groupTask,
        tasks: hide ? [] : [task],
      });
    } else {
      const group = groups.get(task.group);
      if (group === undefined || group.groupTask === undefined) {
        return;
      }
      // set group start and end
      group.groupTask = {
        ...group.groupTask,
        start:
          group.groupTask.start < task.start
            ? group.groupTask.start
            : task.start,
        end: group.groupTask.end > task.end ? group.groupTask.end : task.end,
      };

      if (!hide) {
        group.tasks.push(task);
      }
    }
  });

  return groups;
}

export const formatTasks = (tasks: Task[], hiddenProjects: string[]) => {
  const finalTasks: Task[] = [];

  const transformedTasks = tasks.map((task) => {
    return {
      ...task,
      start: new Date(task.start),
      end: new Date(task.end),
    };
  });

  const projects = extractProjects(transformedTasks, hiddenProjects);

  projects.forEach((project) => {
    finalTasks.push(project.projectTask);
    finalTasks.push(...project.tasks);
  });

  return finalTasks;

  // return tasks.map((task) => {
  //   return {
  //     ...task,
  //     start: new Date(task.start),
  //     end: new Date(task.end),
  //   };
  // });
};

export const useTasks = (
  initialTasks: Task[],
  hiddenProjects: string[],
  groupsVisible: boolean,
) => {
  const tasks = useMemo(() => {
    const filteredTasks = initialTasks.map((task) => {
      return {
        ...task,
        group: groupsVisible ? task.group : "",
      };
    });
    return formatTasks(filteredTasks, hiddenProjects);
  }, [initialTasks, hiddenProjects, groupsVisible]);
  return { tasks };
};
