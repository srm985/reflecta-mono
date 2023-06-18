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
            <div className={`${displayName}__tab`}>
                <span>{label}</span>
            </div>
            <div className={`${displayName}__card`}>{children}</div>
        </div>
    );
};

StorybookExampleComponent.displayName = 'StorybookExampleComponent';

export default StorybookExampleComponent;
