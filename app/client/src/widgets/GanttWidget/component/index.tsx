import { Classes, Switch } from "@blueprintjs/core";
import { LabelPosition } from "components/constants";
import { BlueprintControlTransform } from "constants/DefaultTheme";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { ComponentProps } from "widgets/BaseComponent";
import { AlignWidgetTypes } from "widgets/constants";
import { Colors } from "constants/Colors";
import { FontStyleTypes } from "constants/WidgetConstants";
import { darkenColor } from "widgets/WidgetUtils";
import { Gantt } from "./gantt/gantt";
import { Task, ViewMode } from "../types/public-types";
import { formatTasks, useTasks } from "./hooks/useTasks";
import useRootHeight from "./hooks/useRootHeight";

export interface GanttComponentProps extends ComponentProps {
  sourceData: Task[];
  label: string;
  viewMode: ViewMode;
  isSwitchedOn: boolean;
  onChange: (isSwitchedOn: boolean) => void;
  isLoading: boolean;
  alignWidget: AlignWidgetTypes;
  labelPosition: LabelPosition;
  isSectorVisible: boolean;
  accentColor: string;
  isDependencyVisible: boolean;
  inputRef?: (ref: HTMLInputElement | null) => any;
  labelTextColor?: string;
  labelTextSize?: string;
  labelStyle?: string;
  isDynamicHeightEnabled?: boolean;
}

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter((t) => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}

const GanttComponentContainer = styled.div<{
  accentColor: string;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: stretch;
  ${BlueprintControlTransform}
`;

const GanttLabel = styled.div<{
  disabled?: boolean;
  alignment: AlignWidgetTypes;
  labelTextColor?: string;
  labelTextSize?: string;
  labelStyle?: string;
  isDynamicHeightEnabled?: boolean;
}>`
  width: 100%;
  display: inline-block;
  vertical-align: top;
  text-align: ${({ alignment }) => alignment.toLowerCase()};
  ${({ disabled, labelStyle, labelTextColor, labelTextSize }) => `
  color: ${disabled ? Colors.GREY_8 : labelTextColor || "inherit"};
  font-size: ${labelTextSize ?? "inherit"};
  font-weight: ${labelStyle?.includes(FontStyleTypes.BOLD) ? "bold" : "normal"};
  font-style: ${
    labelStyle?.includes(FontStyleTypes.ITALIC) ? "italic" : "normal"
  };
  `}

  ${({ isDynamicHeightEnabled }) =>
    isDynamicHeightEnabled ? "&& { word-break: break-all; }" : ""};
`;

export const StyledGantt = styled(Switch)<{
  $accentColor: string;
  inline?: boolean;
}>`
  &.${Classes.CONTROL} {
    & input:checked ~ .${Classes.CONTROL_INDICATOR} {
      background: ${({ $accentColor }) => `${$accentColor}`} !important;
      border: 1px solid ${({ $accentColor }) => `${$accentColor}`} !important;
    }

    &:hover input:checked:not(:disabled) ~ .bp3-control-indicator,
    input:checked:not(:disabled):focus ~ .bp3-control-indicator {
      background: ${({ $accentColor }) =>
        `${darkenColor($accentColor)}`} !important;
      border: 1px solid ${({ $accentColor }) =>
        `${darkenColor($accentColor)}`} !important;
    }
  }

  &.${Classes.SWITCH} {
    ${({ inline }) => (!!inline ? "" : "width: 100%;")}
    & input:not(:disabled):active:checked ~ .${Classes.CONTROL_INDICATOR} {
      background: ${({ $accentColor }) => `${$accentColor}`} !important;
    }
  }
`;

function GanttComponent({
  accentColor,
  viewMode = ViewMode.Day,
  sourceData,
  isDependencyVisible,
  isSectorVisible,
  alignWidget = AlignWidgetTypes.LEFT,
  inputRef,
  isDisabled,
  isDynamicHeightEnabled,
  isLoading,
  isSwitchedOn,
  label,
  labelPosition,
  labelStyle,
  labelTextColor,
  labelTextSize,
  onChange,
}: GanttComponentProps): JSX.Element {
  let columnWidth = 65;
  if (viewMode === ViewMode.Year) {
    columnWidth = 350;
  } else if (viewMode === ViewMode.Month) {
    columnWidth = 300;
  } else if (viewMode === ViewMode.Week) {
    columnWidth = 250;
  }
  const [hiddenProjects, setHiddenProjects] = useState<string[]>([]);
  const { tasks } = useTasks(sourceData, hiddenProjects, isSectorVisible);
  // const [tasks, setTasks] = useState<Task[]>([]);
  const rootHeight = useRootHeight();

  // useEffect(() => {
  //   const tasks = formatTasks(sourceData, hiddenProjects);
  //   setTasks(tasks);
  // }, [sourceData, hiddenProjects]);

  // const handleTaskChange = (task: Task) => {
  //   console.log("On date change Id:" + task.id);
  //   let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
  //   if (task.project) {
  //     const [start, end] = getStartEndDateForProject(newTasks, task.project);
  //     const project =
  //       newTasks[newTasks.findIndex((t) => t.id === task.project)];

  //     if (
  //       project !== undefined &&
  //       (project.start.getTime() !== start.getTime() ||
  //         project.end.getTime() !== end.getTime())
  //     ) {
  //       const changedProject = { ...project, start, end };
  //       newTasks = newTasks.map((t) =>
  //         t.id === task.project ? changedProject : t,
  //       );
  //     }
  //   }
  //   setTasks(newTasks);
  // };

  const handleExpanderClick = (task: Task) => {
    if (!task.id) return;
    if (hiddenProjects.includes(task.id)) {
      setHiddenProjects((h) => h.filter((p) => p !== task.id));
    } else {
      setHiddenProjects([...hiddenProjects, task.id]);
    }
  };

  console.log(isSectorVisible);

  return (
    <GanttComponentContainer accentColor={accentColor}>
      {sourceData && sourceData.length > 0 && (
        <Gantt
          columnWidth={columnWidth}
          ganttHeight={
            document.getElementById("art-board")
              ? undefined
              : rootHeight
              ? rootHeight - 250
              : undefined
          }
          hideDependencies={!isDependencyVisible}
          listCellWidth={"200px"}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          locale="pl"
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onDateChange={() => {}}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onExpanderClick={handleExpanderClick}
          rowHeight={40}
          tasks={tasks}
          viewMode={viewMode}
        />
      )}
    </GanttComponentContainer>
  );
}

export default GanttComponent;
