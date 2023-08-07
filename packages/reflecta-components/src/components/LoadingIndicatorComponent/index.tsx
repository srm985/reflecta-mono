import {
    FC
} from 'react';

import {
    ILoadingIndicatorComponent
} from './types';

import './styles.scss';

const LoadingIndicatorComponent: FC<ILoadingIndicatorComponent> = (props) => {
    const {
        isVisible
    } = props;

    const {
        displayName
    } = LoadingIndicatorComponent;

    const tickMarks = [];

    for (let index = 0; index < 20; index++) {
        tickMarks.push(<div
            className={`${displayName}__tick ${displayName}__tick-${index}`}
            key={index}
        />);
    }

    return (
        isVisible && (
            <div className={displayName}>
                <div className={`${displayName}__indicator`}>
                    {tickMarks}
                </div>
            </div>
        )
    );
};

LoadingIndicatorComponent.displayName = 'LoadingIndicatorComponent';

export default LoadingIndicatorComponent;
