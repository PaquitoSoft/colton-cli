import React from 'react';

import FormInput from '../../../shared/form-input/form-input';
import Button from '../../../shared/button/button';
import Link from '../../../shared/link/link';

import './forgot-password-form.css';

function ForgotPasswordForm({ onBackClicked }) {
	return (
		<div className="forgot-password-form">
			<p className="forgot-password-form__title">Recover your password</p>
			<p className="forgot-password-form__subtitle">Type your email and we will send you a message with a link to set a new password for your account</p>
			<form action="/api/reset-password" className="forgot-password-form__form">
				<FormInput 
					className="forgot-password-form__form-input" 
					type="text" 
					name="email" 
					placeholder="Type your email"
					required
				/>
				<Button 
					className="forgot-password-form__login-button" 
					isActive={true}
				>RESET PASSWORD</Button>
				<Link 
					href="/login" 
					className="forgot-password-form__back"
					onClick={(event) => {
						event.preventDefault();
						onBackClicked();
					}}
				>Back to login</Link>
			</form>
		</div>
	);
}

export default ForgotPasswordForm;
