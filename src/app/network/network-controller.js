const networks = require('../../config').networks

const getNetwork = (req, res, next) => {

    res.send(networks)
}

module.exports.getNetwork = getNetwork