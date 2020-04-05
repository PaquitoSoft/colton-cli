import React, { useState } from 'react';

import { useAppContext } from '../../../shared/app-context/app-context';
import { getDataFromForm } from '../../../../plugins/form-helpers';

import FormInput from '../../../shared/form-input/form-input';
import Button from '../../../shared/button/button';

import './update-password-form.css';
import Alert from '../../../shared/alert/alert';

const UPDATE_PASSWORD_MUTATION = `
	mutation UpdateUserPassword($newPassword: String!) {
		updateUserPassword(newPassword: $newPassword) {
			email
			nickname
		}
	}
`;

function UpdatePasswordForm() {
	const { apiClient } = useAppContext();
	const [isWorking, setIsWorking] = useState(false);
	const [operationSuccess, setOperationSuccess] = useState(false);
	const [formError, setFormError] = useState();

	const onSubmit = (event) => {
		event.preventDefault();
		event.persist(); // This allow to get the event target after the server responds
		const { password, passwordRepeat } = getDataFromForm(event.target);
		
		if (password !== passwordRepeat) {
			return setFormError('Input passwords does not match');
		}

		apiClient.sendMutation({
			mutation: UPDATE_PASSWORD_MUTATION,
			variables: { newPassword: password }
		})
		.then(() => {
			setIsWorking(false);
			setOperationSuccess(true);
			setFormError(null);
			setTimeout(() => setOperationSuccess(false), 2500);
			event.target.reset();
		})
		.catch(([error]) => {
			setIsWorking(false);
			setFormError(error.message);
		});
		setIsWorking(true);
		setFormError(null);
		setOperationSuccess(false);
	}

	return (
		<section className="update-password-form">
			<h2 className="update-password-form__title">Update your password</h2>
			<form onSubmit={onSubmit}>
				<FormInput 
					type="password"
					name="password"
					className="update-password-form__control"
					placeholder="New password"
					required
				/>
				<FormInput 
					type="password" 
					name="passwordRepeat"
					className="update-password-form__control"
					placeholder="Repeat password" 
					required
				/>
				<Button 
					className="update-password-form__save-button" 
					kind="primary"
					isWorking={isWorking}
				>UPDATE</Button>
				{!!operationSuccess && <Alert className="update-password-form__operation-message">Your password has been updated</Alert>}
				{!!formError && <Alert className="update-password-form__operation-message" type="error">{formError}</Alert>}
			</form>
		</section>
	);
}

export default UpdatePasswordForm;
