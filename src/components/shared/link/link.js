import React from 'react';
import { Link as RouterLink } from "@reach/router";

import './link.css';

function Link({ className = '', children, href="", ...props}) {
	return (
		<RouterLink to={href} className={`app-link ${className}`} {...props}>{children}</RouterLink>
	);
}

export default Link;
