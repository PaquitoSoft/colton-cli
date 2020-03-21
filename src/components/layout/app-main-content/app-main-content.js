import React from 'react';

import './app-main-content.css';

function AppMainContent({ children }) {
	return (
		<main className="app-main-content">{children}</main>
	);
}

export default AppMainContent;
