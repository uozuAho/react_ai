import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { EnthusiasmAction } from './react_ui/redux/actions';
import './index.css';
import { enthusiasm } from './react_ui/redux/reducers/index';
import { IStoreState } from './react_ui/redux/IStoreState';
import { App } from './react_ui/components/App';

const store = createStore<IStoreState, EnthusiasmAction, {}, {}>(enthusiasm, {
  enthusiasmLevel: 1,
  languageName: 'TypeScript',
},
(window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
