import {
    ColorGroupDetails
} from './types';

import colorVariables from '@styles/_colors.scss';

import './styles.scss';

const ColorItemComponent = (props: ColorGroupDetails) => {
    const {
        groupColorsList = [],
        groupName
    } = props;

    const {
        displayName
    } = ColorItemComponent;

    const colorSwatchesList = groupColorsList.map((colorDetails) => (
        <div className={`${displayName}__swatch-container`}>
            <div
                className={`${displayName}__swatch`}
                style={{
                    backgroundColor: colorDetails.colorValue
                }}
            />
            <div>
                <p>{colorDetails.colorName}</p>
                <p>{colorDetails.colorValue.toUpperCase()}</p>
            </div>
        </div>
    ));

    return (
        <div className={displayName}>
            <p>{groupName}</p>
            <div className={`${displayName}__group-colors-container`}>
                {colorSwatchesList}
            </div>
        </div>
    );
};

ColorItemComponent.displayName = 'ColorItemComponent';

const ColorPaletteComponent = () => {
    const {
        displayName
    } = ColorPaletteComponent;

    const colorGroupsList: ColorGroupDetails[] = [];

    const capitalizeWord = (word: string): string => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`;

    const generateSCSSColorVariableName = (phrase: string): string => `$${phrase.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;

    Object.entries(colorVariables).forEach(([
        colorDetails,
        colorValue
    ]) => {
        const groupNameDetails: string[] = colorDetails.split('_')[2].split('-');
        const groupName: string = `${capitalizeWord(groupNameDetails[0])}${groupNameDetails.length > 2 ? ` (${capitalizeWord(groupNameDetails[1])} ${capitalizeWord(groupNameDetails[2])})` : ''}`;
        const groupOrder: number = parseInt(colorDetails.split('-')[0].split('_')[1], 10) - 1;
        const colorName: string = colorDetails.split('_')[4];

        const {
            [groupOrder]: {
                groupColorsList = []
            } = {}
        } = colorGroupsList;

        colorGroupsList[groupOrder] = {
            groupColorsList: [
                ...groupColorsList,
                {
                    colorName: generateSCSSColorVariableName(colorName),
                    colorValue: colorValue as string
                }
            ],
            groupName
        };
    });

    const colorItemComponentsList = colorGroupsList.map((groupDetails) => {
        const {
            groupColorsList = []
        } = groupDetails;

        const colors: { [key: string]: string } = {};

        groupColorsList.forEach((colorDetails) => {
            colors[colorDetails.colorName] = colorDetails.colorValue;
        });

        return (
            <ColorItemComponent {...groupDetails} />
        );
    });

    return (
        <div className={displayName}>{colorItemComponentsList}</div>
    );
};

ColorPaletteComponent.displayName = 'ColorPaletteComponent';

export default ColorPaletteComponent;
