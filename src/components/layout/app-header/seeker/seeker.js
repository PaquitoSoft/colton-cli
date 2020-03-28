import React, { useState } from 'react';
import { useNavigate, useParams } from '@reach/router';

import { ReactComponent as SearchIcon } from './search.svg';

import './seeker.css';

function Seeker() {
	const navigate = useNavigate();
	const { searchTerm: querySearchTerm } = useParams();
	const [searchTerm, setSearchTerm] = useState(querySearchTerm || '');

	const onFormSubmit = (event) => {
		event.preventDefault();
		navigate(`/search/${searchTerm}`);
	};

	return (
		<div className="seeker">
			<form name="search-form" className="seeker__form" onSubmit={onFormSubmit}>
				<SearchIcon className="seeker__search-icon" />
				<input 
					type="text" 
					name="searchTerm" 
					className="seeker__search-input" 
					placeholder="Search" 
					autoComplete="off"
					onChange={(e) => setSearchTerm(e.target.value)} 
					value={searchTerm}
				/>
			</form>
		</div>
	);
}

export default Seeker;
