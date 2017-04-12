const networkController = require('./network-controller')

const init = (app) => {

    /**
     * Retrieves the full network setup
     * @return {Object[]} 
     */
    app.get('/api/network', networkController.getNetwork)
}

module.exports.init = init