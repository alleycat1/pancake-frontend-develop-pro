/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementType } from "react";
import { FlexProps } from "../Box";
import { DropdownMenuItemType } from "../DropdownMenu/types";

export type SubMenuItemsType = {
  label: string;
  href: string;
  itemProps?: any;
  icon?: ElementType<any>;
  disabled?: boolean;
  isMobileOnly?: boolean;
  type?: DropdownMenuItemType;
  onClick?: React.MouseEvent<HTMLElement>;
  LabelIcon?: ElementType<any>;
};

export interface SubMenuItemsProps extends FlexProps {
  items?: SubMenuItemsType[];
  activeItem?: string;
  isMobileOnly?: boolean;
}
