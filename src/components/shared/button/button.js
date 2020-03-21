import React from 'react';

import { ReactComponent as LoaderIcon } from './loop_24px.svg';
import './button.css';

function Button({ className = '', isActive = false, isWorking = false, children, ...props }) {
	return (
		<button 
			className={`app-button ${className} ${isActive ? 'app-button--active' : ''}`}
			disabled={isWorking}
			{...props}
		>
			{isWorking ?
				<LoaderIcon className="app-button__loader-icon" />
				:
				children
			}
			
		</button>
	);
}

export default Button;
