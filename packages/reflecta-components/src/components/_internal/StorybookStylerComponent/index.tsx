import {
    FC
} from 'react';

import classNames from '@utils/classNames';

import {
    IStorybookStylerComponent
} from './types';

import './styles.scss';

const StorybookStylerComponent: FC<IStorybookStylerComponent> = (props) => {
    const {
        children,
        className
    } = props;

    const {
        displayName
    } = StorybookStylerComponent;

    const componentClassNames = classNames(
        displayName,
        className
    );

    return (<div className={componentClassNames}>{children}</div>);
};

StorybookStylerComponent.displayName = 'StorybookStylerComponent';

export default StorybookStylerComponent;
