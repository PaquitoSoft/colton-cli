import React, { useContext, useState } from 'react';
import { redirectTo } from "@reach/router";

import { getValue, storeValue, removeValue } from '../../../plugins/local-cache';
import { CACHE } from '../../../constants';

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

export function AppProvider({ apiClient, user, player, children } ) {
	const initialThemeMode = getValue(STORAGE_THEME_MODE_KEY) || THEME_MODES.LIGHT;
	const [error, setError] = useState(null);
	const [themeMode, setThemeMode] = useState(initialThemeMode);
	const [_user, setUser] = useState(user);
	
	const providerInitialValue = {
		apiClient,
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
