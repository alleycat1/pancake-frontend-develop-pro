import { Placement, Padding, PositioningStrategy } from "@popperjs/core";

export interface TooltipRefs {
  targetRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  tooltip: React.ReactNode;
  tooltipVisible: boolean;
  forceUpdate: (() => void) | null;
}

export interface TooltipOptions {
  strategy?: PositioningStrategy;
  placement?: Placement;
  trigger?: TriggerType;
  arrowPadding?: Padding;
  tooltipPadding?: Padding;
  tooltipOffset?: [number, number];
  hideTimeout?: number;
  manualVisible?: boolean;
  avoidToStopPropagation?: boolean;
  isInPortal?: boolean;
}

export type TriggerType = "click" | "hover" | "focus";
