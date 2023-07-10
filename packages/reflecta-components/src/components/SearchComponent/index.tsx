import {
    faSearch,
    faSliders
} from '@fortawesome/free-solid-svg-icons';
import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    FC,
    useMemo,
    useState
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
    DateSearchOption,
    ISearchComponent,
    KeywordSearchOption,
    SearchKeyword
} from './types';

import './styles.scss';

const SearchComponent: FC<ISearchComponent> = (props) => {
    const {
        className,
        onSearch
    } = props;

    const {
        displayName
    } = SearchComponent;

    const now = useMemo(() => new Date().toISOString().split('T')[0], []);

    const [
        searchString,
        setSearchString
    ] = useState<string>('');

    const [
        searchKeywordsList,
        updateSearchKeywordsList
    ] = useState<SearchKeyword[]>([]);

    const [
        isAdvancedSearchVisible,
        setAdvancedSearchVisible
    ] = useState<boolean>(true);

    const [
        useAISearch,
        setUseAISearch
    ] = useState<boolean>(true);

    const [
        keywordSearchOption,
        setKeywordSearchOption
    ] = useState<KeywordSearchOption>('disabled');

    const [
        dateSearchOption,
        setDateSearchOption
    ] = useState<DateSearchOption>('disabled');

    const [
        entryDate,
        setEntryDate
    ] = useState<string>(now);

    const [
        searchStartDate,
        setSearchStartDate
    ] = useState<string>(now);

    const [
        searchEndDate,
        setSearchEndDate
    ] = useState<string>(now);

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

    const handleSearch = () => {
        // Just a placeholder
        updateSearchKeywordsList([]);

        onSearch({
            dateSearchOption,
            entryDate,
            keywordSearchOption,
            searchEndDate,
            searchKeywordsList,
            searchStartDate,
            searchString,
            useAISearch
        });
    };

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
                className={`${displayName}__basic-search`}
                layoutDefault={{
                    alignItems: 'flex-end'
                }}
            >
                <InputComponent
                    className={'mr--2'}
                    label={'Search your entries'}
                    name={'entrySearch'}
                    onChange={setSearchString}
                    type={'search'}
                    value={searchString}
                />
                <ButtonComponent
                    className={'mr--1'}
                    color={'primary'}
                    isIconOnly
                    onClick={handleSearch}
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
                    className={'mb--3'}
                    label={'Keyword search'}
                    name={'keywordSearch'}
                    onChange={(value) => setKeywordSearchOption(value as KeywordSearchOption)}
                    options={keywordSearchOptionsList}
                    value={keywordSearchOption}
                />
                <FlexboxComponent
                    className={`${displayName}__date-search-block`}
                    layoutDefault={{
                        flexDirection: 'column'
                    }}
                    layoutDesktop={{
                        flexDirection: 'row'
                    }}
                >
                    <SelectComponent
                        className={'mb--2'}
                        label={'Date search'}
                        name={'dateSearch'}
                        onChange={(value) => setDateSearchOption(value as DateSearchOption)}
                        options={dateSearchOptionsList}
                        value={dateSearchOption}
                    />
                    {
                        dateSearchOption === 'entryDate' && (
                            <InputComponent
                                label={'Entry date'}
                                name={'entryDate'}
                                onChange={setEntryDate}
                                type={'date'}
                                value={entryDate}
                            />
                        )
                    }
                    {
                        dateSearchOption === 'dateRange' && (
                            <>
                                <InputComponent
                                    label={'Start date'}
                                    name={'startDate'}
                                    onChange={setSearchStartDate}
                                    type={'date'}
                                    value={searchStartDate}
                                />
                                <InputComponent
                                    label={'End date'}
                                    name={'endDate'}
                                    onChange={setSearchEndDate}
                                    type={'date'}
                                    value={searchEndDate}
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
                        onClick={handleSearch}
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