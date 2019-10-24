import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const persistConfig = {
    key: 'root',
    storage: storage,
    // blacklist: ['flash']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares = [thunk];

export const store = createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares))
);

export const persistor = persistStore(store);