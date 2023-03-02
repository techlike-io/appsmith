import IconSVG from "./icon.svg";
import Widget from "./widget";
import { LabelPosition } from "components/constants";
import { AlignWidgetTypes } from "widgets/constants";

export const CONFIG = {
  features: {
    dynamicHeight: {
      sectionIndex: 1,
      active: true,
    },
  },
  type: Widget.getWidgetType(),
  name: "Gantt",
  iconSVG: IconSVG,
  needsMeta: true,
  searchTags: ["gantt"],
  defaults: {
    sourceData: {},
    label: "Label",
    rows: 4,
    columns: 12,
    defaultSwitchState: true,
    widgetName: "Gantt",
    alignWidget: AlignWidgetTypes.LEFT,
    labelPosition: LabelPosition.Left,
    version: 1,
    isDisabled: false,
    isDependencyVisible: true,
    isSectorVisible: true,
    animateLoading: true,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
    contentConfig: Widget.getPropertyPaneContentConfig(),
    styleConfig: Widget.getPropertyPaneStyleConfig(),
    stylesheetConfig: Widget.getStylesheetConfig(),
  },
};

export default Widget;
