import React from 'react';

import Layout from '../../layout/layout';
import UpdatePasswordForm from './update-password-form/update-password-form';

import './settings-view.css';

function SettingsView() {
	return (
		<Layout>
			<div className="settings-view">
				<h1 className="settings-view__title">YOUR SETTINGS</h1>
				<UpdatePasswordForm />
			</div>
		</Layout>
	);
}

export default SettingsView;
