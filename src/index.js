import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { createStore } from 'redux';
import rootReducer from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { PersistGate } from 'redux-persist/integration/react';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['shouldAlwaysLoadTimeseries','snapshotDaysToLoad','savedLocation','shouldSaveLocation']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(
  persistedReducer,
  (
    typeof window === 'object' 
    && window.__REDUX_DEVTOOLS_EXTENSION__ 
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ) && window.__REDUX_DEVTOOLS_EXTENSION__({
    stateSanitizer: (state) => state.storedGeojson ? { ...state, storedData: '<<EXCLUDED>>', storedGeojson: '<<EXCLUDED>>' } : state
  })
);
const persistor = persistStore(store)
document.onkeydown = (e) => {
  if (e.key === 'x'){
    persistor.purge();
    alert('Reload to clear saved preferences.')
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>

    <button id="new-content-button" className="hidden" onClick={() => window.location.reload(true)}>
      <span>New data or features are available</span>
      Click here to reload
    </button>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();