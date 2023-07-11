import {
    FC
} from 'react';

import FlexboxComponent from '@components/FlexboxComponent';

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

    return (
        <FlexboxComponent
            className={componentClassNames}
            layoutDefault={{
                flexWrap: 'wrap',
                rowGap: 'large'
            }}
        >{children}
        </FlexboxComponent>
    );
};

StorybookStylerComponent.displayName = 'StorybookStylerComponent';

export default StorybookStylerComponent;
