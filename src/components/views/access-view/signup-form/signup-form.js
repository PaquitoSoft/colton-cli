import React from 'react';

import FormInput from '../../../shared/form-input/form-input';
import Button from '../../../shared/button/button';

import './signup-form.css';

function SignupForm() {
	return (
		<div className="signup-form">
			<p className="login-form__title">Create an account</p>
			<form action="/api/login" className="login-form__form">
				<FormInput className="login-form__form-input" type="text" name="username" placeholder="Username" required />
				<FormInput className="login-form__form-input" type="text" name="email" placeholder="Email" required />
				<FormInput className="login-form__form-input" type="password" name="password" placeholder="Password" required />
				<Button className="login-form__login-button" isActive={true}>SIGN UP</Button>
			</form>
		</div>
	);
}

export default SignupForm;
