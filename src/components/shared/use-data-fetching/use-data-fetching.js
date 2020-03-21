import { useState, useEffect } from 'react';
import { useAppContext } from '../app-context/app-context';

export default function useDataFetching({
	query, params = {}
}) {
	const { apiClient, setError } = useAppContext();
	const [isFetching, setIsFetching] = useState(true);
	const [data, setData] = useState();
	const paramsHash = btoa(JSON.stringify(params));
	
	useEffect(() => {
		let ignore = false;
		setIsFetching(true);
		apiClient.sendQuery({ query, variables: params })
		.then(result => {
			if (ignore) return null;

			if (result.errors) {
				setError(result.errors);
			} else {
				setData(result.data);
			}
			
			setIsFetching(false);
		})
		.catch(async ([error]) => {
			const { errors } = await error.stack.json();
			setError(errors[0]);
			setIsFetching(false);
		});

		return () => ignore = true;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paramsHash]);
	
	return {
		isFetching,
		data
	};
}
