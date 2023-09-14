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

export type FlexWrap =
  | 'nowrap'
  | 'wrap'
  | 'wrap-reverse';

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

export type ColumnGap =
| 'small'
| 'medium'
| 'large'
| 'xlarge';

export type RowGap =
| 'small'
| 'medium'
| 'large'
| 'xlarge';

export type Layout = {
    alignItems?: AlignItems;
    columnGap?: ColumnGap;
    flexDirection?: FlexDirection;
    flexWrap?: FlexWrap;
    isFullHeight?: boolean;
    justifyContent?: JustifyContent;
    rowGap?: RowGap;
};

export type IFlexboxComponent = {
    children: ReactNode | ReactNode[];
    className?: string;
    layoutDefault?: Layout;
    layoutDesktop?: Layout | undefined;
};
