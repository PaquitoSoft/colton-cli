import { getValue, storeValue } from './local-cache.js';

const _xmlParser = new DOMParser();

function checkResponseStatus(res) {
	if (res.status < 400) {
		return res;
	} else {
		let error = new Error(res.statusText);
		error.statusCode = res.status;
		error.response = res;
		throw error;
	}
}

function parseXml(res) {
	return res.text().then(text => ({
		result: _xmlParser.parseFromString(text, 'application/xml'),
		url: res.url
	}));
}

function parseJson(res) {
	return res.json().then(data => ({
		result: data,
		url: res.url
	}));
}

function parseResponse(res) {
	const contentType = (res.headers.get('Content-Type') || 'plain/text').split(';')[0];

	switch (contentType) {
		case 'application/json':
			return parseJson(res);
		case 'application/xml':
		case 'text/html':
		case 'application/xhtml+xml':
			return parseXml(res);
		default:
			return res.text().then(text => ({ result: text, url: res.url }));
	}
}

function cacheResponse(ttl = 0, key) {
	return (data) => {
		if (ttl) {
			console.log('Ajax::cacheResponse# Caching response with key:', key, 'for', ttl, 'minutes.');
			storeValue(data.url, data.result, ttl); // Last parameter is TTL in minutes
		}
		return data.result;
	}
}

// TTL in minutes
export function getData(url, options = { ttl: 0 }) {
	let data = getValue(url);

	if (data) {
		return Promise.resolve(data);
	} else {
		return fetch(url)
			.then(checkResponseStatus)
			.then(parseResponse)
			.then(cacheResponse(options.ttl, url));
	}
}
