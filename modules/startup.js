module.exports = {
	port: getPort
}

function getPort (args) {
	if (args[2] != undefined) {
		return args[2];
	}
	return 8080;
}