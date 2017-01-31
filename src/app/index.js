module.exports.init = ( app ) => {
    
    // aliasing
    app.del = app.delete

    // test route
    app.get('/', (req, res, next) => res.send('api works'))

    require('./event').init( app )

}