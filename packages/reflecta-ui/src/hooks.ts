import {
    TypedUseSelectorHook,
    useDispatch,
    useSelector
} from 'react-redux';

import type {
    AppDispatch,
    RootState
} from './store';

// Required for TypeScript + Redux Thunk
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
