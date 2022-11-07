const validUrl = require('valid-url')
exports.isValidUrl = (value) => {
	if (validUrl.isUri(value)) return true
	return false
}
