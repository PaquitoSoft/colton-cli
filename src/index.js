import React from 'react';
import ReactDOM from 'react-dom';

import { CACHE, API } from './constants';

import * as serviceWorker from './serviceWorker';
import { getValue } from './plugins/local-cache';
import Player from './services/player';
import ApiClient from './plugins/api-client';

import { AppProvider } from './components/shared/app-context/app-context';
import App from './app';

if (process.env.NODE_ENV === 'production') {
	if (window.location.protocol === 'http') {
		window.location.href = window.location.href.replace('http', 'https');
	}
}

const user = getValue(CACHE.userKey);
const playlist = getValue(CACHE.currentPlaylist);
const player = new Player({ playlist });
const apiClient = new ApiClient({
	apiUrl: API.host,
	userToken: user && user.token
});

ReactDOM.render(
	<AppProvider 
		apiClient={apiClient} 
		user={user} 
		player={player}
	>
		<App player={player} />
	</AppProvider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
