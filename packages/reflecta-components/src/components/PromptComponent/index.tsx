import {
    FC
} from 'react';

import ButtonBlockComponent from '@components/ButtonBlockComponent';
import ButtonComponent from '@components/ButtonComponent';
import ModalComponent from '@components/ModalComponent';

import {
    IPromptComponent
} from './types';

const PromptComponent: FC<IPromptComponent> = (props) => {
    const {
        label,
        message,
        promptPrimary,
        promptSecondary
    } = props;

    const {
        displayName
    } = PromptComponent;

    return (
        <ModalComponent
            className={displayName}
            onClose={promptSecondary.onClick}
        >
            <h3 className={'mb--4'}>{label}</h3>
            <p className={'mb--8'}>{message}</p>
            <ButtonBlockComponent>
                <ButtonComponent
                    onClick={promptSecondary.onClick}
                    styleType={'inline'}
                >
                    {promptSecondary.label}
                </ButtonComponent>
                <ButtonComponent
                    color={promptPrimary.color}
                    onClick={promptPrimary.onClick}
                    styleType={'primary'}
                >
                    {promptPrimary.label}
                </ButtonComponent>
            </ButtonBlockComponent>
        </ModalComponent>
    );
};

PromptComponent.displayName = 'PromptComponent';

export default PromptComponent;
