require("dotenv").config();

module.exports = {
    server: {
        port: 808,
    },
    database: {
        mysql_uri: process.env.DATABASE_URL,
    }
}