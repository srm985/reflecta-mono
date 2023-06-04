import React from 'react';
import {
    IColorPalette
} from 'reflecta-components/declarations/src/components/ColorPalette/types';

export default React.lazy(() => import('reflecta-components-module-federation/ColorPalette')) as React.FC<IColorPalette>;
