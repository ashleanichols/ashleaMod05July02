const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        port: process.env.PORT || 4500,
        dbUrl: `mongodb+srv://admin:admin12345@cluster0-fyce0.mongodb.net/kinguniwiki?retryWrites=true&w=majority`,
        cookie: process.env.COOKIE,
        user: process.env.USER,
    },
    production: {}
}

module.exports = config[env];