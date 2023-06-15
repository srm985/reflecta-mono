import {
    FC
} from 'react';

import {
    IRootStylingComponent
} from './types';

import '@styles/styles.scss';

import './styles.scss';

const RootStylingComponent: FC<IRootStylingComponent> = () => {
    const {
        displayName
    } = RootStylingComponent;

    return (<div className={displayName} />);
};

RootStylingComponent.displayName = 'RootStylingComponent';

export default RootStylingComponent;
