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

import ButtonBlockComponent from '@components/ButtonBlockComponent';
import ButtonComponent from '@components/ButtonComponent';
import CardComponent from '@components/CardComponent';
import CheckboxComponent from '@components/CheckboxComponent';
import FlexboxComponent from '@components/FlexboxComponent';
import InputComponent from '@components/InputComponent';
import SelectComponent from '@components/SelectComponent';

import classNames from '@utils/classNames';

import {
    ISearchComponent
} from './types';

import './styles.scss';

const SearchComponent: FC<ISearchComponent> = (props) => {
    const {
        className
    } = props;

    const {
        displayName
    } = SearchComponent;

    const [
        isAdvancedSearchVisible,
        setAdvancedSearchVisible
    ] = useState(true);

    const [
        useAISearch,
        setUseAISearch
    ] = useState(true);

    const [
        keywordSearchOption,
        setKeywordSearchOption
    ] = useState('disabled');

    const [
        dateSearchOption,
        setDateSearchOption
    ] = useState('disabled');

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

    const handleReset = () => {
        setUseAISearch(true);
        setKeywordSearchOption('disabled');
        setDateSearchOption('disabled');
    };

    const keywordSearchOptionsList = [
        {
            label: 'Disabled',
            value: 'disabled'
        },
        {
            label: 'Matches all',
            value: 'matchesAll'
        },
        {
            label: 'Matches any',
            value: 'matchesAny'
        }
    ];

    const dateSearchOptionsList = [
        {
            label: 'Disabled',
            value: 'disabled'
        },
        {
            label: 'Entry date',
            value: 'entryDate'
        },
        {
            label: 'Date range',
            value: 'dateRange'
        }
    ];

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
                <h4 className={'mb--3'}>{'Advanced search toolbar'}</h4>
                <CheckboxComponent
                    checked={useAISearch}
                    className={'mb--3'}
                    label={'AI search'}
                    name={'aiSearch'}
                    onChange={setUseAISearch}
                />
                <SelectComponent
                    className={'mb--2'}
                    label={'Keyword search'}
                    name={'keywordSearch'}
                    onChange={setKeywordSearchOption}
                    options={keywordSearchOptionsList}
                    value={keywordSearchOption}
                />
                <FlexboxComponent
                    alignItems={'flex-start'}
                    className={`${displayName}__date-search-block`}
                >
                    <SelectComponent
                        className={'mb--2'}
                        label={'Date search'}
                        name={'dateSearch'}
                        onChange={setDateSearchOption}
                        options={dateSearchOptionsList}
                        value={dateSearchOption}
                    />
                    {
                        dateSearchOption === 'entryDate' && (
                            <InputComponent
                                label={'Entry date'}
                                name={'entryDate'}
                                onChange={() => {}}
                                type={'date'}
                                value={''}
                            />
                        )
                    }
                    {
                        dateSearchOption === 'dateRange' && (
                            <>
                                <InputComponent
                                    label={'Start date'}
                                    name={'startDate'}
                                    onChange={() => {}}
                                    type={'date'}
                                    value={''}
                                />
                                <InputComponent
                                    label={'End date'}
                                    name={'endDate'}
                                    onChange={() => {}}
                                    type={'date'}
                                    value={''}
                                />
                            </>
                        )
                    }
                </FlexboxComponent>
                <ButtonBlockComponent className={'mt--4'}>
                    <ButtonComponent
                        color={'warning'}
                        onClick={handleReset}
                        styleType={'secondary'}
                    >{'Reset'}
                    </ButtonComponent>
                    <ButtonComponent
                        color={'primary'}
                        styleType={'primary'}
                    >{'Apply'}
                    </ButtonComponent>
                </ButtonBlockComponent>
            </CardComponent>
        </div>
    );
};

SearchComponent.displayName = 'SearchComponent';

export default SearchComponent;
