/* global YT */
import React, { useContext, useState, useEffect } from 'react';
import { redirectTo } from "@reach/router";

import { getValue, storeValue, removeValue } from '../../../plugins/local-cache';
import { CACHE } from '../../../constants';
import Player from '../../../services/player';

export const THEME_MODES = {
	LIGHT: 'light',
	DARK: 'dark'
}

const STORAGE_THEME_MODE_KEY = 'tmk';
const noop = () => false;

const AppContext = React.createContext({
	apiClient: undefined,
	player: undefined,
	currentUser: undefined,
	loginUser: noop,
	logoutUser: noop,
	error: null,
	setError: noop,
	themeMode: undefined,
	toggleThemeMode: noop
});

export function AppProvider({ apiClient, user, children } ) {
	const initialThemeMode = getValue(STORAGE_THEME_MODE_KEY) || THEME_MODES.LIGHT;
	const [error, setError] = useState(null);
	const [themeMode, setThemeMode] = useState(initialThemeMode);
	const [_user, setUser] = useState(user);
	const [player, setPlayer] = useState(null);
	const [playerStatus, setPlayerStatus] = useState(0);
	const providerInitialValue = {
		apiClient,
		player,
		playerStatus,
		currentUser: _user,
		loginUser: (user) => {
			setUser(user);
			storeValue(CACHE.userKey, user);
			apiClient.updateUserToken(user.token);
		},
		logoutUser: () => {
			setUser(null);
			removeValue(CACHE.userKey);
			redirectTo('/');
		},
		error, 
		setError,
		themeMode: initialThemeMode,
		toggleThemeMode: () => {
			const newThemeMode = themeMode !== THEME_MODES.LIGHT ? THEME_MODES.LIGHT : THEME_MODES.DARK;
			setThemeMode(newThemeMode);
			storeValue(STORAGE_THEME_MODE_KEY, newThemeMode);
		}
	};

	useEffect(() => {
		window.onYouTubeIframeAPIReady = function() {
			const onReady = () => {
				setPlayer(new Player({
					engine,
					onStatusChange: (newStatus) => {
						setPlayerStatus(newStatus);
					}
				}));
			};
			const engine = new YT.Player('yt-player', {
				width: '480',
				height: '270',
				events: { 
					onReady,
					onError: (error) => console.error(error)
				}
			});
		};

		const tag = document.createElement('script');
		tag.src = 'https://www.youtube.com/iframe_api';
		document.body.appendChild(tag);
	}, []);

	return (
		<AppContext.Provider value={providerInitialValue}>
			{children}
		</AppContext.Provider>
	);
}

export function useAppContext() {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useAppContext must be used within an AppContext.Provider')
	}
	return context;
}
