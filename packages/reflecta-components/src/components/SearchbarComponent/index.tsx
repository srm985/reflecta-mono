import {
    faSearch,
    faSliders
} from '@fortawesome/free-solid-svg-icons';
import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    FC, useState
} from 'react';

import ButtonComponent from '@components/ButtonComponent';
import CardComponent from '@components/CardComponent';
import FlexboxComponent from '@components/FlexboxComponent';
import InputComponent from '@components/InputComponent';

import classNames from '@utils/classNames';

import {
    ISearchbarComponent
} from './types';

import './styles.scss';

const SearchbarComponent: FC<ISearchbarComponent> = (props) => {
    const {
        className
    } = props;

    const {
        displayName
    } = SearchbarComponent;

    const [
        isAdvancedSearchVisible,
        setAdvancedSearchVisible
    ] = useState(false);

    const componentClassNames = classNames(
        displayName,
        className
    );

    const advancedSearchClassNames = classNames(
        `${displayName}__advanced-search`,
        {
            [`${displayName}__advanced-search--visible`]: isAdvancedSearchVisible
        }
    );

    console.log({
        isAdvancedSearchVisible
    });

    return (
        <div className={componentClassNames}>
            <FlexboxComponent
                alignItems={'flex-end'}
                className={`${displayName}__basic-search`}
            >
                <InputComponent
                    className={'mr--2'}
                    label={'Search your entries'}
                    name={'entrySearch'}
                    onChange={() => {}}
                    type={'search'}
                    value={''}
                />
                <ButtonComponent
                    className={'mr--1'}
                    color={'primary'}
                    isIconOnly
                    styleType={'primary'}
                >
                    <FontAwesomeIcon icon={faSearch} />
                </ButtonComponent>
                <ButtonComponent
                    color={'neutral'}
                    isIconOnly
                    onClick={() => setAdvancedSearchVisible(!isAdvancedSearchVisible)}
                    styleType={'secondary'}
                >
                    <FontAwesomeIcon icon={faSliders} />
                </ButtonComponent>
            </FlexboxComponent>
            <CardComponent className={advancedSearchClassNames}>
                <InputComponent
                    label={'Advanced search'}
                    name={'advancedSearchEnable'}
                    onChange={() => {}}
                    type={'checkbox'}
                    value={'checked'}
                />
                <InputComponent
                    label={'Entry date'}
                    name={'entryDate'}
                    onChange={() => {}}
                    type={'date'}
                    value={''}
                />
            </CardComponent>
        </div>
    );
};

SearchbarComponent.displayName = 'SearchbarComponent';

export default SearchbarComponent;
