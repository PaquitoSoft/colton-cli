import React from 'react';

import FormInput from '../../../shared/form-input/form-input';
import Button from '../../../shared/button/button';
import Link from '../../../shared/link/link';

import './login-form.css';

function LoginForm({ onForgotPasswordClicked }) {
	
	return (
		<div className="login-form">
			<p className="login-form__title">Welcome back!</p>

			<form action="/api/login" className="login-form__form">
				<FormInput 
					className="login-form__form-input" 
					type="text" 
					name="username" 
					placeholder="Username"
				/>
				<FormInput 
					className="login-form__form-input" 
					type="password" 
					name="password" 
					placeholder="Password" 
				/>
				<Button 
					className="login-form__login-button" 
					isActive={true}
				>LOG IN</Button>
				<Link 
					href="/account-reset" 
					className="login-form__forgot-password"
					onClick={(event) => {
						event.preventDefault();
						onForgotPasswordClicked();
					}}
				>Forgot your password?</Link>
			</form>
		</div>
	);
}

export default LoginForm;
