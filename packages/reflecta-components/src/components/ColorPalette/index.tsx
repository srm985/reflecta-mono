import colorVariables from '../../styles/_colors.scss';

import {
    ColorGroupDetails
} from './types';

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
            <p>{colorDetails.colorName}</p>
            <p>{colorDetails.colorValue.toUpperCase()}</p>
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
        const groupName: string = colorDetails.split('-')[0].split('_')[2];
        const groupOrder: number = parseInt(colorDetails.split('-')[0].split('_')[1], 10) - 1;
        const colorName: string = colorDetails.split('-')[1].split('_')[2];

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
            groupName: capitalizeWord(groupName)
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
