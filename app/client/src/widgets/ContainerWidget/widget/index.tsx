import React from "react";

import ContainerComponent, { ContainerStyle, FlexBox } from "../component";
import WidgetFactory, { DerivedPropertiesMap } from "utils/WidgetFactory";
import {
  CONTAINER_GRID_PADDING,
  GridDefaults,
  MAIN_CONTAINER_WIDGET_ID,
  WIDGET_PADDING,
} from "constants/WidgetConstants";

import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";

import { ValidationTypes } from "constants/WidgetValidation";

import WidgetsMultiSelectBox from "pages/Editor/WidgetsMultiSelectBox";
import { CanvasSelectionArena } from "pages/common/CanvasArenas/CanvasSelectionArena";
import { compact, map, sortBy } from "lodash";

import { CanvasDraggingArena } from "pages/common/CanvasArenas/CanvasDraggingArena";
import { getCanvasSnapRows } from "utils/WidgetPropsUtils";

class ContainerWidget extends BaseWidget<
  ContainerWidgetProps<WidgetProps>,
  WidgetState
> {
  constructor(props: ContainerWidgetProps<WidgetProps>) {
    super(props);
    this.renderChildWidget = this.renderChildWidget.bind(this);
  }

  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "General",
        children: [
          {
            helpText: "Controls the visibility of the widget",
            propertyName: "isVisible",
            label: "Visible",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "animateLoading",
            label: "Animate Loading",
            controlType: "SWITCH",
            helpText: "Controls the loading of the widget",
            defaultValue: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "Enables scrolling for content inside the widget",
            propertyName: "shouldScrollContents",
            label: "Scroll Contents",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
          },
        ],
      },
      {
        sectionName: "Styles",
        children: [
          {
            helpText: "Use a html color name, HEX, RGB or RGBA value",
            placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
            propertyName: "backgroundColor",
            label: "Background Color",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "Use a html color name, HEX, RGB or RGBA value",
            placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
            propertyName: "borderColor",
            label: "Border Color",
            controlType: "COLOR_PICKER",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "Enter value for border width",
            propertyName: "borderWidth",
            label: "Border Width",
            placeholderText: "Enter value in px",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.NUMBER },
          },
          {
            propertyName: "borderRadius",
            label: "Border Radius",
            helpText:
              "Rounds the corners of the icon button's outer border edge",
            controlType: "BORDER_RADIUS_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "boxShadow",
            label: "Box Shadow",
            helpText:
              "Enables you to cast a drop shadow from the frame of the widget",
            controlType: "BOX_SHADOW_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {};
  }
  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }
  static getMetaPropertiesMap(): Record<string, any> {
    return {};
  }

  getSnapSpaces = () => {
    const { componentWidth } = this.getComponentDimensions();
    // For all widgets inside a container, we remove both container padding as well as widget padding from component width
    let padding = (CONTAINER_GRID_PADDING + WIDGET_PADDING) * 2;
    if (
      this.props.widgetId === MAIN_CONTAINER_WIDGET_ID ||
      this.props.type === "CONTAINER_WIDGET"
    ) {
      //For MainContainer and any Container Widget padding doesn't exist coz there is already container padding.
      padding = CONTAINER_GRID_PADDING * 2;
    }
    if (this.props.noPad) {
      // Widgets like ListWidget choose to have no container padding so will only have widget padding
      padding = WIDGET_PADDING * 2;
    }
    let width = componentWidth;
    width -= padding;
    return {
      snapRowSpace: GridDefaults.DEFAULT_GRID_ROW_HEIGHT,
      snapColumnSpace: componentWidth
        ? width / GridDefaults.DEFAULT_GRID_COLUMNS
        : 0,
    };
  };

  renderChildWidget(childWidgetData: WidgetProps): React.ReactNode {
    // For now, isVisible prop defines whether to render a detached widget
    if (childWidgetData.detachFromLayout && !childWidgetData.isVisible) {
      return null;
    }

    const { componentHeight, componentWidth } = this.getComponentDimensions();

    childWidgetData.rightColumn = componentWidth;
    childWidgetData.bottomRow = this.props.shouldScrollContents
      ? childWidgetData.bottomRow
      : componentHeight;
    childWidgetData.minHeight = componentHeight;
    childWidgetData.isVisible = this.props.isVisible;
    childWidgetData.shouldScrollContents = false;
    childWidgetData.canExtend = this.props.shouldScrollContents;

    childWidgetData.parentId = this.props.widgetId;
    // Pass layout controls to children
    childWidgetData.useAutoLayout = this.props.useAutoLayout;
    childWidgetData.direction = this.props.direction;
    childWidgetData.justifyContent = this.props.justifyContent;
    childWidgetData.alignItems = this.props.alignItems;

    return WidgetFactory.createWidget(childWidgetData, this.props.renderMode);
  }

  renderChildren = () => {
    return map(
      // sort by row so stacking context is correct
      // TODO(abhinav): This is hacky. The stacking context should increase for widgets rendered top to bottom, always.
      // Figure out a way in which the stacking context is consistent.
      this.props.useAutoLayout
        ? this.props.children
        : sortBy(compact(this.props.children), (child) => child.topRow),
      this.renderChildWidget,
    );
  };

  renderAsContainerComponent(props: ContainerWidgetProps<WidgetProps>) {
    // console.log(`${props.widgetName} : ${props.widgetId} =======`);
    // console.log(props);
    const snapRows = getCanvasSnapRows(props.bottomRow, props.canExtend);
    return (
      <ContainerComponent {...props}>
        {props.type === "CANVAS_WIDGET" && (
          <>
            <CanvasDraggingArena
              {...this.getSnapSpaces()}
              alignItems={props.alignItems}
              canExtend={props.canExtend}
              direction={props.direction}
              dropDisabled={!!props.dropDisabled}
              noPad={this.props.noPad}
              parentId={props.parentId}
              snapRows={snapRows}
              useAutoLayout={props.useAutoLayout}
              widgetId={props.widgetId}
            />
            <CanvasSelectionArena
              {...this.getSnapSpaces()}
              canExtend={props.canExtend}
              dropDisabled={!!props.dropDisabled}
              parentId={props.parentId}
              snapRows={snapRows}
              widgetId={props.widgetId}
            />
          </>
        )}
        <WidgetsMultiSelectBox
          {...this.getSnapSpaces()}
          noContainerOffset={!!props.noContainerOffset}
          widgetId={this.props.widgetId}
          widgetType={this.props.type}
        />
        {/* without the wrapping div onClick events are triggered twice */}
        <FlexBox
          alignItems={this.props.alignItems}
          direction={this.props.direction}
          justifyContent={this.props.justifyContent}
          useAutoLayout={this.props.useAutoLayout}
        >
          {this.renderChildren()}
        </FlexBox>
      </ContainerComponent>
    );
  }

  getPageView() {
    return this.renderAsContainerComponent(this.props);
  }

  static getWidgetType(): string {
    return "CONTAINER_WIDGET";
  }
}

export interface ContainerWidgetProps<T extends WidgetProps>
  extends WidgetProps {
  children?: T[];
  containerStyle?: ContainerStyle;
  shouldScrollContents?: boolean;
  noPad?: boolean;
}

interface ContainerWidgetState<T extends WidgetProps> extends WidgetState {
  items?: T[];
}

export default ContainerWidget;
