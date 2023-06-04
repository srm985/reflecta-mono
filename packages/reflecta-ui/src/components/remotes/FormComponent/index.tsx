import React from 'react';
import {
    IFormComponent
} from 'reflecta-components/declarations/src/components/FormComponent/types';

export default React.lazy(() => import('reflecta-components-module-federation/FormComponent')) as React.FC<IFormComponent>;
