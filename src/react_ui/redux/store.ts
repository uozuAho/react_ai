import { createStore } from 'redux';
import { EnthusiasmAction } from './actions';
import { enthusiasm } from './reducers';

export interface IStoreState {
    languageName: string;
    enthusiasmLevel: number;
}

export const createReduxStore = () => {
    const store = createStore<IStoreState, EnthusiasmAction, {}, {}>(
        enthusiasm,
        {
            enthusiasmLevel: 1,
            languageName: 'TypeScript',
        },
        (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    );
    return store;
}
