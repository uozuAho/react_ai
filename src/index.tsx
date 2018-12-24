import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { EnthusiasmAction } from './react_ui/actions';
import Hello from './react_ui/containers/Hello';
import './index.css';
import { enthusiasm } from './react_ui/reducers/index';
import registerServiceWorker from './react_ui/registerServiceWorker';
import { IStoreState } from './react_ui/types';

const store = createStore<IStoreState, EnthusiasmAction, {}, {}>(enthusiasm, {
  enthusiasmLevel: 1,
  languageName: 'TypeScript',
},
(window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
  <Provider store={store}>
    <Hello />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
