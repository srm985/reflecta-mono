import {
    ReactElement
} from 'react';

import {
    IButtonComponent
} from '@components/ButtonComponent/types';

export type IButtonBlockComponent = {
    children: ReactElement<IButtonComponent> | ReactElement<IButtonComponent>[];
    className?: string;
    isAlwaysInline?: boolean;
};
