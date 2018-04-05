import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider } from 'react-apollo';
import client from './client'

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root'),
);
// ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
