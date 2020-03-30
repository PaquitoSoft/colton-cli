import React, { useState } from 'react';

import { getDataFromForm } from '../../../../plugins/form-helpers';
import { useAppContext } from '../../../shared/app-context/app-context';

import Alert from '../../../shared/alert/alert';
import FormInput from '../../../shared/form-input/form-input';
import Button from '../../../shared/button/button';

import './signup-form.css';

const CREATE_USER_MUTATION = `
	mutation CreateUser($user: NewUser) {
		createUser(user: $user) {
			user {
				nickname
				email
			}
			authToken
		}
	}
`;

function SignupForm({ onSuccess }) {
	const [isWorking, setIsWorking] = useState(false);
	const [formError, setFormError] = useState(null);
	const { apiClient } = useAppContext();

	const onSubmit = (event) => {
		event.preventDefault();
		const { email, nickname, password } = getDataFromForm(event.target);
		
		setIsWorking(true);
		apiClient.sendMutation({
			mutation: CREATE_USER_MUTATION,
			variables: { user: { email, nickname, password } }
		})
		.then(({ data: { createUser: result} }) => {
			setIsWorking(false);
			setFormError(null);
			onSuccess({
				...result.user,
				token: result.authToken
			});
		})
		.catch(([error]) => {
			setIsWorking(false);
			setFormError(error);
			// Ups! It seems that's not your password
		});
	}

	return (
		<div className="signup-form">
			<p className="login-form__title">Create an account</p>
			<form action="/api/login" className="login-form__form" onSubmit={onSubmit}>
				<FormInput className="login-form__form-input" type="text" name="nickname" placeholder="Username" required />
				<FormInput className="login-form__form-input" type="text" name="email" placeholder="Email" required />
				<FormInput className="login-form__form-input" type="password" name="password" placeholder="Password" required />
				<Button 
					className="login-form__login-button" 
					kind="primary"
					isWorking={isWorking}
				>SIGN UP</Button>
				{!!formError && <Alert className="signup-form__error">{formError.message}</Alert>}
			</form>
		</div>
	);
}

export default SignupForm;
