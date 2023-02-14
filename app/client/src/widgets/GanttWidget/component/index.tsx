import { Classes, Switch } from "@blueprintjs/core";
import { LabelPosition } from "components/constants";
import { BlueprintControlTransform } from "constants/DefaultTheme";
import React, { useMemo } from "react";
import styled from "styled-components";
import { ComponentProps } from "widgets/BaseComponent";
import { AlignWidgetTypes } from "widgets/constants";
import { Colors } from "constants/Colors";
import { FontStyleTypes } from "constants/WidgetConstants";
import { darkenColor } from "widgets/WidgetUtils";
import { Gantt } from "./gantt/gantt";
import { Task, ViewMode } from "../types/public-types";

export interface GanttComponentProps extends ComponentProps {
  sourceData: Task[];
  label: string;
  viewMode: ViewMode;
  isSwitchedOn: boolean;
  onChange: (isSwitchedOn: boolean) => void;
  isLoading: boolean;
  alignWidget: AlignWidgetTypes;
  labelPosition: LabelPosition;
  accentColor: string;
  inputRef?: (ref: HTMLInputElement | null) => any;
  labelTextColor?: string;
  labelTextSize?: string;
  labelStyle?: string;
  isDynamicHeightEnabled?: boolean;
}

export function initTasks() {
  const currentDate = new Date();
  const tasks: Task[] = [
    {
      start: new Date("2023-01-31T23:00:00.000Z"),
      end: new Date("2023-02-14T23:00:00.000Z"),
      name: "Some Projects",
      id: "ProjectSample",
      progress: 25,
      type: "project",
      hideChildren: false,
      displayOrder: 1,
    },
    {
      start: new Date("2023-01-31T23:00:00.000Z"),
      end: new Date("2023-02-02T11:28:00.000Z"),
      name: "Idea",
      id: "Task 0",
      progress: 45,
      type: "task",
      project: "ProjectSample",
      displayOrder: 2,
    },
    {
      start: new Date("2023-02-01T23:00:00.000Z"),
      end: new Date("2023-02-03T23:00:00.000Z"),
      name: "Research",
      id: "Task 1",
      progress: 25,
      dependencies: ["Task 0"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 3,
    },
    {
      start: new Date("2023-02-03T23:00:00.000Z"),
      end: new Date("2023-02-07T23:00:00.000Z"),
      name: "Discussion with team",
      id: "Task 2",
      groupExpanded: true,
      progress: 10,
      dependencies: ["Task 1", "Task 4"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 4,
    },
    {
      start: new Date("2023-02-07T23:00:00.000Z"),
      end: new Date("2023-02-08T23:00:00.000Z"),
      name: "Developing",
      id: "Task 3",
      progress: 2,
      dependencies: ["Task 2"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 5,
    },
    {
      start: new Date("2023-02-07T23:00:00.000Z"),
      end: new Date("2023-02-09T23:00:00.000Z"),
      name: "Review",
      id: "Task 4",
      type: "task",
      progress: 70,
      dependencies: ["Task 2", "Task 0"],
      project: "ProjectSample",
      displayOrder: 6,
    },
    {
      start: new Date("2023-02-14T23:00:00.000Z"),
      end: new Date("2023-02-14T23:00:00.000Z"),
      name: "Release",
      id: "Task 6",
      progress: 1,
      type: "milestone",
      dependencies: ["Task 4", "Task 0"],
      project: "ProjectSample",
      displayOrder: 7,
    },
    {
      start: new Date("2023-02-17T23:00:00.000Z"),
      end: new Date("2023-02-18T23:00:00.000Z"),
      name: "Party Time",
      id: "Task 9",
      progress: 0,
      isDisabled: true,
      type: "task",
    },
  ];
  return tasks;
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

  return (
    <GanttComponentContainer accentColor={accentColor}>
      {sourceData && sourceData.length > 0 && (
        <Gantt
          columnWidth={columnWidth}
          locale="pl"
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onDateChange={() => {}}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onExpanderClick={() => {}}
          tasks={sourceData}
          viewMode={viewMode}
        />
      )}
    </GanttComponentContainer>
  );
}

export default GanttComponent;
