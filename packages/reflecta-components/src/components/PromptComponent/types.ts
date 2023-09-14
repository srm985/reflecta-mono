import {
    Color
} from '@components/ButtonComponent/types';

export type PromptAction = {
    label: string;
    onClick: () => void;
};

export type PromptActionPrimary = PromptAction & {
    color: Color;
};

export type IPromptComponent = {
    label: string;
    message: string;
    promptPrimary: PromptActionPrimary;
    promptSecondary: PromptAction;
};
