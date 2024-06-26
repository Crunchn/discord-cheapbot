
// Require Sequelize
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite',
});

/*
* equivalent to: CREATE TABLE tags(
* name VARCHAR(255) UNIQUE,
* description TEXT,
* username VARCHAR(255),
* usage_count  INT NOT NULL DEFAULT 0
* );
*/
const Tags = sequelize.define('tags', {
    channel: {
		type: Sequelize.STRING,
		unique: true,
	}
});

exports.Tags = Tags
