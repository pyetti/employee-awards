let mysql = require('mysql');

module.exports = {
	pool: mysql.createPool({
				connectionLimit	: 10,
				host  			: '35.196.130.143',
				user  			: 'root',
				password		: '25ptisGaAOdgBn3C',
				database		: 'employee_rewards'
			})
};
