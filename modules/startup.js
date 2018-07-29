module.exports = {
	port: getPort,
    env: setEnv
};

function getPort (args) {
	if (args[2] !== undefined) {
		return args[2];
	}
	return 8080;
}

function setEnv(args) {
    if (args[3] !== undefined) {
        process.env.ENVIRONMENT = args[3]
    } else {
        process.env.ENVIRONMENT = '_prod'
    }
}
