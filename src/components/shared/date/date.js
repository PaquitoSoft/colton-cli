import React from 'react';

import './date.css';

// export const TYPES = {
// 	short: 1
// };

function AppDate({ date/*, type = TYPES.short*/ }) {
	console.log('....', date, new Date(date));
	const _date = (typeof date === 'string') ? new Date(date) : date;
	const formattedDate = _date.toLocaleDateString();
	// const formattedDate = 'foo date';
	return (
		<span className="app-date">{formattedDate}</span>
	);
}

export default AppDate;
