import axios from 'axios';
import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createMiddleware from './middleware/clientMiddleware';

export default function createStore(data) {
  const middleware = [createMiddleware(axios), thunk];

  let finalCreateStore;
  const { persistState } = require('redux-devtools');
  finalCreateStore = compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : null,
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(_createStore);

  const reducer = require('./modules/reducer');
  const store = finalCreateStore(reducer, data);


  if (module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
