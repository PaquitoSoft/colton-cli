export function getDataFromForm(form) {
	const result = {};
	const formData = new FormData(form);
	for (let [inputName, inputValue] of formData.entries()) {
		result[inputName] = inputValue;
	}
	return result;
}
