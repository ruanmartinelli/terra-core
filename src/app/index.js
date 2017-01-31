module.exports.init = ( app ) => {
    
    // aliasing
    app.del = app.delete

    // test route
    app.get('/', (req, res, next) => res.sendFile('../../public/index.html'))

    require('./event').init( app )

}