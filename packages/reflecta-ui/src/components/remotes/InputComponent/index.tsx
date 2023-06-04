import React from 'react';
import {
    IInputComponent
} from 'reflecta-components/declarations/src/components/InputComponent/types';

export default React.lazy(() => import('reflecta-components-module-federation/InputComponent')) as React.FC<IInputComponent>;
