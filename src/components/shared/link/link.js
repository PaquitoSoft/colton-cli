import React from 'react';

import './link.css';

function Link({ className = '', children, ...props}) {
	return (
		<a className={`app-link ${className}`} {...props}>{children}</a>
	);
}

export default Link;
