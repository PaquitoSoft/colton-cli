import React from 'react';

import './alert.css';

function Alert({ className = '', children }) {
	return (
		<div className={`app-alert ${className}`}>{children}</div>
	);
}

export default Alert;
