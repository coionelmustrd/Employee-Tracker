const {Pool} = require('pg');

const db = new Pool({
    host: 'localhost',
    port: 5432,
    database: "employee_db",
    user: 'postgres',
    password: '1969',
    
})

module.exports = db