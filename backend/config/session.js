const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

console.log('Attempting to connect session store with URI:', process.env.MONGODB_URI);

const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions',
});
const sessionMiddleware = session({
    store: store,
    credentials: true,
    cookie: {
        httpOnly: false,
        secure: false,
    },
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    maxAge: 20000,
});

const wrap = expressMiddleware => (socket, next) => expressMiddleware(socket.request, {}, next);

module.exports = { sessionMiddleware, wrap };
