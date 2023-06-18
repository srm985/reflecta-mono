import {
    ReactElement
} from 'react';

import {
    IGridItemComponent
} from '@components/GridItemComponent/types';

export interface IGridContainerComponent {
    children: ReactElement<IGridItemComponent> | ReactElement<IGridItemComponent>[];
    className?: string;
}
