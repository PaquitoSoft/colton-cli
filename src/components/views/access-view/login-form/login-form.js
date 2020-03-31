import React, { useState } from 'react';

import { getDataFromForm } from '../../../../plugins/form-helpers';

import { useAppContext } from '../../../shared/app-context/app-context';
import FormInput from '../../../shared/form-input/form-input';
import Button from '../../../shared/button/button';
import Link from '../../../shared/link/link';
import Alert from '../../../shared/alert/alert';

import './login-form.css';

const LOGIN_MUTATION = `
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			user {
				nickname
				email
			}
			authToken
		}
	}
`;

function LoginForm({ onForgotPasswordClicked, onLoginSuccess }) {
	const [isWorking, setIsWorking] = useState(false);
	const [formError, setFormError] = useState(null);
	const { apiClient } = useAppContext();

	const onSubmit = (event) => {
		event.preventDefault();
		const data = getDataFromForm(event.target);
		
		apiClient.sendMutation({
			mutation: LOGIN_MUTATION,
			variables: { email: data.email, password: data.password }
		})
		.then(({ data: { login: result} }) => {
			setIsWorking(false);
			setFormError(null);
			onLoginSuccess({
				...result.user,
				token: result.authToken
			});
		})
		.catch(([error]) => {
			setIsWorking(false);
			setFormError(error);
			// Ups! It seems that's not your password
		});
		setIsWorking(true);
	}

	return (
		<div className="login-form">
			<p className="login-form__title">Welcome back!</p>

			<form action="/api/login" className="login-form__form" onSubmit={onSubmit}>
				<FormInput 
					className="login-form__form-input" 
					type="text" 
					name="email" 
					placeholder="Email"
					required
				/>
				<FormInput 
					className="login-form__form-input" 
					type="password" 
					name="password" 
					placeholder="Password" 
					required
				/>
				<Button 
					className="login-form__login-button" 
					kind="primary"
					isWorking={isWorking}
				>LOG IN</Button>
				{!!formError && <Alert className="login_form__error" type="error">{formError.message}</Alert>}
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
