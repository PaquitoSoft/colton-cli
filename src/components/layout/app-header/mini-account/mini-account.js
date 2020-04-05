import React, { useState, useEffect } from 'react';
import { useNavigate } from '@reach/router';
import md5 from 'md5';

import { useAppContext } from '../../../shared/app-context/app-context';

import './mini-account.css';

function MiniAccount() {
	const navigate = useNavigate();
	const { currentUser, logoutUser } = useAppContext();
	const [isMenuVisible, setIsMenuVisible] = useState(false);
	const onKeyup = (event) => {
		if (event.keyCode === 27) {
			setIsMenuVisible(false)
		}
	};
	
	useEffect(() => {
		window.addEventListener('keyup', onKeyup);
		return () => {
			window.removeEventListener('keyup', onKeyup);
		}
	}, []);

	return (
		<div className="mini-account">
			<button 
				className="mini-account__button"
				onClick={() => setIsMenuVisible(!isMenuVisible)}
			>
				<img 
					className="mini-account__user-icon"
					src={`https://www.gravatar.com/avatar/${md5(currentUser.email)}?s=48}`} 
					alt={currentUser.nickname}
				/>
			</button>
			<div className={`mini-account__menu ${isMenuVisible ? 'mini-account__menu--visible' : ''}`}>
				<ul className="mini-account__list">
					<li className="mini-account__list-item" onClick={() => navigate('/settings')}>Settings</li>
					<li className="mini-account__list-item" onClick={logoutUser}>Logout</li>
				</ul>
			</div>
		</div>
	);
}

export default MiniAccount;
