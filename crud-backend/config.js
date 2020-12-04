return module.exports = config = {
    mongo: {
        uri: process.env.MONGO_URL ||
        'mongodb://localhost:27017/userslist',
        options: []
    },
};