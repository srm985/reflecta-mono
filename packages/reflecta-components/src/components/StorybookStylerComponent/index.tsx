import {
    FC
} from 'react';

import classNames from '@utils/classNames';

import {
    IStorybookStyler
} from './types';

import './styles.scss';

const StorybookStyler: FC<IStorybookStyler> = (props) => {
    const {
        children,
        className
    } = props;

    const {
        displayName
    } = StorybookStyler;

    const componentClassNames = classNames(
        displayName,
        className
    );

    return (<div className={componentClassNames}>{children}</div>);
};

StorybookStyler.displayName = 'StorybookStyler';

export default StorybookStyler;
