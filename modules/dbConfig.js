let mysql = require('mysql');

module.exports = {
	pool: mysql.createPool({
				connectionLimit	: 10,
				socketPath    		: '/cloudsql/windy-smoke-209201:us-east1:employee-rewards', // '35.196.130.143',
				user  			: 'root',
				password		: '25ptisGaAOdgBn3C',
				database		: 'employee_rewards'
			})
};
