import {
    ReactNode
} from 'react';

type AlignItems =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'baseline'
  | 'stretch';

type FlexDirection =
  | 'row'
  | 'row-reverse'
  | 'column'
  | 'column-reverse';

type JustifyContent =
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

export interface IFlexboxComponent {
    alignItems?: AlignItems;
    children: ReactNode | ReactNode[];
    className?: string;
    flexDirection?: FlexDirection;
    isFullHeight?: boolean;
    justifyContent?: JustifyContent;
}
