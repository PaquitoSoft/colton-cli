import React from 'react';

import './icon-button.css';

function IconButton({ className = '', children, ...props }) {
	return (
		<button className={`icon-button ${className}`} {...props}>{children}</button>
	)
}

export default IconButton;
