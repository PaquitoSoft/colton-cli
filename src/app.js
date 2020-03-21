import React from 'react';

import Layout from './components/layout/layout';
import AccessView from './components/views/access-view/access-view';

import './app.css';
import { useAppContext } from './components/shared/app-context/app-context';


function App() {
	const { currentUser } = useAppContext();

	return (
		<div className="app">
			{!!currentUser ? <Layout /> : <AccessView />}
		</div>
	);
}

export default App;
