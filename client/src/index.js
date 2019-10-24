import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
} from 'react-router-dom';
// Redux
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
// Containers
import App from './containers/App';
// Theme
import { MuiThemeProvider } from '@material-ui/core/styles';
import MuiTheme from './Theme';

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <MuiThemeProvider theme={MuiTheme}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </MuiThemeProvider>
        </PersistGate>
    </Provider>,
    document.getElementById('root'));