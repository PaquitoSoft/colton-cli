import React from 'react';

import Button from '../../button/button';

import './success-message.css';

function SuccessMessage({ message, onExit }) {
	return (
		<div className="success-message">
			<p>{message}</p>
			<Button 
				className="success-message__close"
				size="small"
				onClick={onExit}
			>Close</Button>
		</div>
	);
}

export default SuccessMessage;
