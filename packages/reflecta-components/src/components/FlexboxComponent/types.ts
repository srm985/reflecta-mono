import {
    ReactNode
} from 'react';

export type AlignItems =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'baseline'
  | 'stretch';

export type FlexDirection =
  | 'row'
  | 'row-reverse'
  | 'column'
  | 'column-reverse';

export type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'start'
  | 'end'
  | 'left'
  | 'right';

export type Layout = {
    alignItems?: AlignItems;
    flexDirection?: FlexDirection;
    isFullHeight?: boolean;
    justifyContent?: JustifyContent;
};

export type IFlexboxComponent = {
    children: ReactNode | ReactNode[];
    className?: string;
    layoutDefault?:Layout;
    layoutDesktop?:Layout;
};
