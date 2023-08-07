import {
    FC,
    memo,
    useEffect,
    useMemo
} from 'react';
import {
    useNavigate
} from 'react-router-dom';

import {
    useAppDispatch,
    useAppSelector
} from '../../hooks';

import GridContainerComponent from '@components/remotes/GridContainerComponent';
import GridItemComponent from '@components/remotes/GridItemComponent';
import JournalEntryDisplayComponent from '@components/remotes/JournalEntryDisplayComponent';
import SearchComponent from '@components/remotes/SearchComponent';

import {
    deleteJournalEntry,
    fetchJournalEntries,
    selectAllJournalEntries
} from '@store/slices/journalEntriesSlice';

import Client from '@utils/Client';

import {
    ROUTE_API_SEARCH,
    ROUTE_UI_JOURNAL_ENTRY
} from '@routes';

import {
    JournalEntry,
    JournalEntryID
} from '@types';

import {
    IDashboardView,
    Search
} from './types';

const client = new Client();

const DashboardView: FC<IDashboardView> = () => {
    const {
        displayName
    } = DashboardView;

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const journalEntriesList = useAppSelector(selectAllJournalEntries);

    useEffect(() => {
        dispatch(fetchJournalEntries());
    }, [
        dispatch
    ]);

    const handleEntryEdit = (entryID: JournalEntryID) => {
        navigate(`${ROUTE_UI_JOURNAL_ENTRY}/edit/${entryID}`);
    };

    const handleEntryDelete = async (entryID: JournalEntryID) => {
        dispatch(deleteJournalEntry(entryID));
    };

    const handleSearch = async (searchDetails: Search) => {
        const payload = await client.get<JournalEntry[]>(ROUTE_API_SEARCH, searchDetails);

        if ('errorMessage' in payload) {
            console.log(payload.errorMessage);
        } else {
            dispatch({
                payload,
                type: 'SET_JOURNAL_ENTRIES_LIST'
            });
        }
    };

    const generatedJournalEntriesList = useMemo(() => journalEntriesList.map((journalEntryDetails) => (
        <GridItemComponent
            breakpointLarge={{
                span: 4
            }}
            breakpointSmall={{
                span: 6
            }}
            key={journalEntryDetails.entryID}
            rowSpan={journalEntryDetails.isHighInterest ? 2 : 1}
        >
            <JournalEntryDisplayComponent
                {...journalEntryDetails}
                key={journalEntryDetails.entryID}
                onDelete={() => handleEntryDelete(journalEntryDetails.entryID)}
                onEdit={() => handleEntryEdit(journalEntryDetails.entryID)}
            />
        </GridItemComponent>
    )), [
        journalEntriesList
    ]);

    return (
        <main className={displayName}>
            <GridContainerComponent className={'mb--8'}>
                <GridItemComponent
                    breakpointLarge={{
                        span: 8
                    }}
                >
                    <SearchComponent onSearch={handleSearch} />
                </GridItemComponent>
            </GridContainerComponent>
            <GridContainerComponent>
                {generatedJournalEntriesList}
            </GridContainerComponent>
        </main>
    );
};

DashboardView.displayName = 'DashboardView';

export default memo(DashboardView);
