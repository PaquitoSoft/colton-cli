import React from 'react';

import './button.css';

function Button({ className = '', isActive = false, children, ...props }) {
	return (
		<button 
			className={`app-button ${className} ${isActive ? 'app-button--active' : ''}`}
			{...props}
		>{children}</button>
	);
}

export default Button;
