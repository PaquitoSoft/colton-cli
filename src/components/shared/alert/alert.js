import React from 'react';

import './alert.css';

// types: info - warning - error
function Alert({ className = '', type = 'info', children }) {
	return (
		<div className={`app-alert app-alert--${type} ${className}`}>{children}</div>
	);
}

export default Alert;
