import React, { useState } from 'react';

import { getDataFromForm } from '../../../../plugins/form-helpers';
import { useAppContext } from '../../../shared/app-context/app-context';

import FormInput from '../../../shared/form-input/form-input';
import Button from '../../../shared/button/button';
import Link from '../../../shared/link/link';

import './forgot-password-form.css';
import Alert from '../../../shared/alert/alert';

const RESET_PASSWORD_MUTATION = `
	mutation ResetPassword($email: String!) {
		resetPassword(email: $email)
	}
`;

function ForgotPasswordForm({ onBackClicked }) {
	const [isWorking, setIsWorking] = useState(false);
	const [formError, setFormError] = useState(null);
	const [resetCompleted, setResetCompleted] = useState(false);
	const { apiClient } = useAppContext();

	const onSubmit = (event) => {
		event.preventDefault();
		const { email } = getDataFromForm(event.target);
		
		setIsWorking(true);
		apiClient.sendMutation({
			mutation: RESET_PASSWORD_MUTATION,
			variables: { email }
		})
		.then(() => {
			setIsWorking(false);
			setFormError(null);
			// TODO Show success message
			setResetCompleted(true);
		})
		.catch(([error]) => {
			setIsWorking(false);
			setFormError(error);
			// Ups! It seems that's not your password
		});
	}
	
	return (
		<div className="forgot-password-form">
			<p className="forgot-password-form__title">Recover your password</p>
			<p className="forgot-password-form__subtitle">Type your email and we will send you a message with a link to set a new password for your account</p>
			<form action="/api/reset-password" className="forgot-password-form__form" onSubmit={onSubmit}>
				<FormInput 
					className="forgot-password-form__form-input" 
					type="text" 
					name="email" 
					placeholder="Type your email"
					required
				/>
				<Button 
					className="forgot-password-form__login-button" 
					kind="primary"
					isWorking={isWorking}
				>RESET PASSWORD</Button>
				{!!formError && <Alert className="forgot-password-form__error" type="error">{formError.message}</Alert>}
				{!!resetCompleted && <Alert className="forgot-password-form__success">We've just sent you an email to complete your password reset.</Alert>}
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
