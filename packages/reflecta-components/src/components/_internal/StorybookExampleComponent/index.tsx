import {
    FC
} from 'react';

import FlexboxComponent from '@components/FlexboxComponent';

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
            {label && <p className={'mb--2 bold'}>{label}</p>}
            <FlexboxComponent
                className={`${displayName}__card`}
                layoutDefault={{
                    flexWrap: 'wrap',
                    justifyContent: 'space-between'
                }}
            >{children}
            </FlexboxComponent>
        </div>
    );
};

StorybookExampleComponent.displayName = 'StorybookExampleComponent';

export default StorybookExampleComponent;
