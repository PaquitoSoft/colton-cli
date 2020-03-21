import FetchQL from 'fetchql';

class ApiClient {
	constructor({ apiUrl, userToken }) {
		this.client = new FetchQL({
			url: apiUrl, // GraphQL server address
			interceptors: [],
			headers: { // customized headers of all requests,
				userToken
			},
			// onStart: function (requestQueueLength) {}, // callback of a new request queue
			// onEnd: function (requestQueueLength) {}, // callback of a request queue finished
			omitEmptyVariables: false // remove null props(null or '') from the variables
		});
	}

	sendQuery({ query, variables }) {
		console.log({ query, variables });
		return this.client.query({ query, variables });
	}

	sendMutation({ mutation, variables }) {
		return this.client.query({ query: mutation, variables });
	}

	createFragment(fragmentDefinition) {
		return this.client.createFragment(fragmentDefinition);
	}
}

export default ApiClient;
