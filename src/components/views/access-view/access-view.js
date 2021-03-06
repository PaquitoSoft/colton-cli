import React, { useState } from 'react';
import { useNavigate } from "@reach/router"

import { useAppContext } from '../../shared/app-context/app-context';

import Button from '../../shared/button/button';
import LoginForm from './login-form/login-form';
import SignupForm from './signup-form/signup-form';
import ForgotPasswordForm from './forgot-password-form/forgot-password-form';

import './access-view.css';

const forms = {
	LOGIN: 1,
	SIGNUP: 2,
	RESET: 3
}

function AccessView() {
	const [currentForm, setCurrentForm] = useState(forms.LOGIN);
	const { loginUser } = useAppContext();
	const navigate = useNavigate();

	const onAccessGranted = (user) => {
		loginUser(user);
		navigate('/home');
	};

	return (
		<div className="access-view">
			<div className="access-view__content">
				<div className="access-view__actions">
					<Button 
						className="access-view__action-button" 
						kind={currentForm !== forms.SIGNUP && 'primary'}
						onClick={() => setCurrentForm(forms.LOGIN)}
					>Log in</Button>
					<Button 
						className="access-view__action-button"
						kind={currentForm === forms.SIGNUP && 'primary'}
						onClick={() => setCurrentForm(forms.SIGNUP)}
					>Sign up</Button>
				</div>
				<div className="access-view__form">
					{
						currentForm === forms.LOGIN && 
						<LoginForm 
							onForgotPasswordClicked={() => setCurrentForm(forms.RESET)}
							onLoginSuccess={onAccessGranted}
						/>
					}
					{currentForm === forms.SIGNUP && <SignupForm onSuccess={onAccessGranted} />}
					{currentForm === forms.RESET && <ForgotPasswordForm onBackClicked={() => setCurrentForm(forms.LOGIN)} />}
				</div>
			</div>
		</div>
	);
}

export default AccessView;
