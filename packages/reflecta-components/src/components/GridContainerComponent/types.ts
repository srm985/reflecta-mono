import {
    ReactElement
} from 'react';

import {
    AlignItems
} from '@components/FlexboxComponent/types';
import {
    IGridItemComponent
} from '@components/GridItemComponent/types';

export interface IGridContainerComponent {
    alignItems?: AlignItems;
    children: ReactElement<IGridItemComponent> | ReactElement<IGridItemComponent>[];
    className?: string;
    isFullHeight?: boolean;
}
