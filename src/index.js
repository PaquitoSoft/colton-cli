import React from 'react';
import ReactDOM from 'react-dom';

import { CACHE, API } from './constants';


import * as serviceWorker from './serviceWorker';
import { getValue } from './plugins/local-cache';
import ApiClient from './plugins/api-client';

import { AppProvider } from './components/shared/app-context/app-context';
import { PlaylistProvider } from './components/shared/playlist-context/playlist-context';
import App from './app';

const user = getValue(CACHE.userKey);
const playlist = getValue(CACHE.currentPlaylist);
const apiClient = new ApiClient({
	apiUrl: API.host,
	userToken: user && user.token
});

ReactDOM.render(
	<AppProvider apiClient={apiClient} user={user}>
		<PlaylistProvider initialPlaylist={playlist}>
			<App />
		</PlaylistProvider>
	</AppProvider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
