import {
    faSearch,
    faSliders,
    faXmark
} from '@fortawesome/free-solid-svg-icons';
import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    FC,
    useMemo,
    useState
} from 'react';

import ButtonComponent from '@components/ButtonComponent';
import CardComponent from '@components/CardComponent';
import CheckboxComponent from '@components/CheckboxComponent';
import FlexboxComponent from '@components/FlexboxComponent';
import InputComponent from '@components/InputComponent';
import SelectComponent from '@components/SelectComponent';

import classNames from '@utils/classNames';
import dateStamp from '@utils/dateStamp';

import {
    DateSearchOption,
    ISearchComponent,
    KeywordSearchOption,
    Search,
    SearchKeyword
} from './types';

import './styles.scss';

const SearchComponent: FC<ISearchComponent> = (props) => {
    const {
        className,
        onReset,
        onSearch
    } = props;

    const {
        displayName
    } = SearchComponent;

    const now = useMemo(() => dateStamp(), []);

    const [
        searchString,
        setSearchString
    ] = useState<string>('');

    const [
        searchKeywordsText,
        setSearchKeywordsText
    ] = useState<string>('');

    const [
        isAdvancedSearchVisible,
        setAdvancedSearchVisible
    ] = useState<boolean>(false);

    const [
        useAISearch,
        setUseAISearch
    ] = useState<boolean>(false);

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

    const [
        isDisplayingSearchResults,
        setIsDisplayingSearchResults
    ] = useState<boolean>(false);

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

    const searchKeywordsList = useMemo<SearchKeyword[]>(() => searchKeywordsText.split(',').map((keyword) => keyword.trim()).filter(Boolean), [
        searchKeywordsText
    ]);

    const buildSearchDetails = (overrides: Partial<Search> = {}): Search => ({
        dateSearchOption,
        entryDate,
        keywordSearchOption,
        searchEndDate,
        searchKeywordsList,
        searchStartDate,
        searchString: searchString.trim(),
        useAISearch,
        ...overrides
    });

    const handleSearchChange = (value: string) => {
        if (!value.trim() && isDisplayingSearchResults) {
            setIsDisplayingSearchResults(false);

            onReset();
        }

        setSearchString(value);
    };

    const handleSearch = (searchDetails = buildSearchDetails()) => {
        setIsDisplayingSearchResults(true);
        onSearch(searchDetails);
    };

    const handleReset = () => {
        setSearchString('');
        setUseAISearch(false);
        setKeywordSearchOption('disabled');
        setDateSearchOption('disabled');
        setEntryDate(now);
        setSearchStartDate(now);
        setSearchEndDate(now);
        setSearchKeywordsText('');
        setIsDisplayingSearchResults(false);
        setAdvancedSearchVisible(false);
        onReset();
    };

    const handleDateShortcutSearch = (searchStartDateOverride: string, labelSearchEndDate = now) => {
        setDateSearchOption('dateRange');
        setSearchStartDate(searchStartDateOverride);
        setSearchEndDate(labelSearchEndDate);
        handleSearch(buildSearchDetails({
            dateSearchOption: 'dateRange',
            searchEndDate: labelSearchEndDate,
            searchStartDate: searchStartDateOverride
        }));
    };

    const handleMeaningSearch = () => {
        setUseAISearch(true);

        if (!searchString.trim()) {
            return;
        }

        handleSearch(buildSearchDetails({
            searchString: searchString.trim(),
            useAISearch: true
        }));
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

    const weekStartDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);

        return dateStamp(date);
    }, []);

    const monthStartDate = useMemo(() => {
        const date = new Date();
        date.setDate(1);

        return dateStamp(date);
    }, []);

    const activeFiltersList = [
        searchString.trim() ? `Text: ${searchString.trim()}` : undefined,
        useAISearch ? 'Search by meaning' : undefined,
        keywordSearchOption !== 'disabled' && searchKeywordsList.length ? `Keywords: ${keywordSearchOption === 'matchesAll' ? 'all' : 'any'} (${searchKeywordsList.join(', ')})` : undefined,
        dateSearchOption === 'entryDate' ? `Date: ${entryDate}` : undefined,
        dateSearchOption === 'dateRange' ? `${searchStartDate} to ${searchEndDate}` : undefined
    ].filter(Boolean);

    return (
        <div className={componentClassNames}>
            <FlexboxComponent
                className={`${displayName}__basic-search`}
                layoutDefault={{
                    alignItems: 'flex-end',
                    columnGap: 'small'
                }}
            >
                <InputComponent
                    className={`${displayName}__basic-search-input`}
                    label={'Find a memory'}
                    name={'entrySearch'}
                    onChange={handleSearchChange}
                    placeholder={'Search words, places, or moments'}
                    type={'search'}
                    value={searchString}
                />
                <ButtonComponent
                    ariaLabel={'Search entries'}
                    className={`${displayName}__basic-search-button`}
                    color={'primary'}
                    isIconOnly
                    onClick={() => handleSearch()}
                    styleType={'primary'}
                    type={'button'}
                >
                    <FontAwesomeIcon icon={faSearch} />
                </ButtonComponent>
                <ButtonComponent
                    ariaLabel={'Open filters'}
                    className={`${displayName}__basic-search-button`}
                    color={'neutral'}
                    isIconOnly
                    onClick={() => setAdvancedSearchVisible(!isAdvancedSearchVisible)}
                    styleType={'secondary'}
                    type={'button'}
                >
                    <FontAwesomeIcon icon={faSliders} />
                </ButtonComponent>
            </FlexboxComponent>
            <div className={`${displayName}__quick-filters`}>
                <ButtonComponent
                    className={`${displayName}__quick-filter-button`}
                    color={'neutral'}
                    onClick={() => handleDateShortcutSearch(weekStartDate)}
                    styleType={'secondary'}
                    type={'button'}
                >{'Past week'}
                </ButtonComponent>
                <ButtonComponent
                    className={`${displayName}__quick-filter-button`}
                    color={'neutral'}
                    onClick={() => handleDateShortcutSearch(monthStartDate)}
                    styleType={'secondary'}
                    type={'button'}
                >{'This month'}
                </ButtonComponent>
                <ButtonComponent
                    className={`${displayName}__quick-filter-button`}
                    color={'secondary'}
                    disabled={!searchString.trim()}
                    onClick={handleMeaningSearch}
                    styleType={'secondary'}
                    type={'button'}
                >{'Search by meaning'}
                </ButtonComponent>
            </div>
            {
                activeFiltersList.length > 0 && (
                    <div className={`${displayName}__active-filters`}>
                        {activeFiltersList.map((activeFilter) => (
                            <span key={activeFilter}>{activeFilter}</span>
                        ))}
                        <button
                            onClick={handleReset}
                            type={'button'}
                        >
                            {'Clear'}
                        </button>
                    </div>
                )
            }
            {
                isAdvancedSearchVisible && (
                    <button
                        aria-label={'Close filters'}
                        className={`${displayName}__advanced-search-background`}
                        onClick={() => setAdvancedSearchVisible(false)}
                        type={'button'}
                    />
                )
            }
            <CardComponent className={advancedSearchClassNames}>
                <FlexboxComponent
                    className={'mb--3'}
                    layoutDefault={{
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <h4>{'Filters'}</h4>
                    <ButtonComponent
                        ariaLabel={'Close filters'}
                        color={'neutral'}
                        isIconOnly
                        onClick={() => setAdvancedSearchVisible(false)}
                        styleType={'inline'}
                        type={'button'}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </ButtonComponent>
                </FlexboxComponent>
                <CheckboxComponent
                    checked={useAISearch}
                    className={'mb--3'}
                    label={'Search by meaning'}
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
                {
                    keywordSearchOption !== 'disabled' && (
                        <InputComponent
                            className={'mb--3'}
                            label={'Keywords'}
                            name={'keywords'}
                            onChange={setSearchKeywordsText}
                            placeholder={'family, work, lake'}
                            type={'search'}
                            value={searchKeywordsText}
                        />
                    )
                }
                <FlexboxComponent
                    className={'mb--7'}
                    layoutDefault={{
                        flexDirection: 'column',
                        rowGap: 'medium'
                    }}
                    layoutDesktop={{
                        columnGap: 'medium',
                        flexDirection: 'row'
                    }}
                >
                    <SelectComponent
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
                <FlexboxComponent
                    layoutDefault={{
                        flexDirection: 'column-reverse',
                        rowGap: 'medium'
                    }}
                    layoutDesktop={{
                        columnGap: 'medium',
                        flexDirection: 'row'
                    }}
                >
                    <ButtonComponent
                        color={'neutral'}
                        onClick={handleReset}
                        styleType={'secondary'}
                        type={'button'}
                    >{'Reset'}
                    </ButtonComponent>
                    <ButtonComponent
                        color={'primary'}
                        onClick={() => handleSearch()}
                        styleType={'primary'}
                        type={'button'}
                    >{'Apply'}
                    </ButtonComponent>
                </FlexboxComponent>
            </CardComponent>
        </div>
    );
};

SearchComponent.displayName = 'SearchComponent';

export default SearchComponent;
