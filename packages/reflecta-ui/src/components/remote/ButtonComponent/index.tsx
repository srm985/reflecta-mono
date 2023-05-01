import React from 'react';
import {
    IButtonComponent
} from 'reflecta-components/declarations/components/ButtonComponent/types';

export default React.lazy(() => import('reflecta-components-module-federation/ButtonComponent')) as React.FC<IButtonComponent>;
