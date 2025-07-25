module.exports = function (mongoose) {
    mongoose.set('useFindAndModify', false);
    mongoose
        .connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('MongoDB Connected…');
        })
        .catch(err => console.error(err));
};