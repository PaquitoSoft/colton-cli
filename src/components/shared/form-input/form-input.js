import React from 'react';

import './form-input.css';

function FormInput({ className, ...props }) {
	return (
		<input className={`form-input ${className}`} {...props} />
	);
}

export default FormInput;
