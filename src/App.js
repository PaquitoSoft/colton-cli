import React from 'react';

import { getValue } from './plugins/local-cache';
import { CACHE } from './constants';

import Layout from './components/layout/layout';
import AccessView from './components/views/access-view/access-view';

import './app.css';

function App() {
	const userToken = getValue(CACHE.userToken);
	console.log({ userToken, foo: !!userToken });
	return (
		<div>
			{!!userToken ? <Layout /> : <AccessView />}
		</div>
	);
}

export default App;
