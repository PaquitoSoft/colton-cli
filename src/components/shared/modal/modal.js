import React from 'react';

import IconButton from '../icon-button/icon-button';
import { ReactComponent as CloseIcon } from './close-icon.svg';

import './modal.css';

function Modal({ size = 'M', onExit, children }) {
	return (
		<div className="modal">
			<div className="modal__overlay" onClick={onExit}></div>
			<div className={`modal__container modal__container--size-${size}`}>
				<div className="modal__header">
					<IconButton><CloseIcon onClick={onExit} /></IconButton>
				</div>
				<div className="modal__content">{children}</div>
				<div className="modal__footer"></div>
			</div>
		</div>
	);
}

export default Modal;
