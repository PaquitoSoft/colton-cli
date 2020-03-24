import React from 'react';

import { ReactComponent as LoaderIcon } from './loop_24px.svg';
import './button.css';

function Button({ 
	className = '', 
	isActive = false, 
	isWorking = false, 
	children, 
	kind = 'basic', // basic, primary, secondary
	size = 'normal', // small, normal, big
	...props 
}) {
	// ${isActive ? 'app-button--active' : ''}
	return (
		<button 
			className={`app-button app-button--${kind} app-button--size-${size} ${className}`}
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
