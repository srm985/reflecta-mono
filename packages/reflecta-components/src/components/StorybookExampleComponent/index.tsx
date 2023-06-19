import {
    FC
} from 'react';

import classNames from '@utils/classNames';

import {
    IStorybookExampleComponent
} from './types';

import './styles.scss';

const StorybookExampleComponent: FC<IStorybookExampleComponent> = (props) => {
    const {
        children,
        className,
        label
    } = props;

    const {
        displayName
    } = StorybookExampleComponent;

    const componentClassNames = classNames(
        displayName,
        className
    );

    return (
        <div className={componentClassNames}>
            <p className={'mb--2 bold'}>{label}</p>
            <div className={`${displayName}__card`}>{children}</div>
        </div>
    );
};

StorybookExampleComponent.displayName = 'StorybookExampleComponent';

export default StorybookExampleComponent;
