const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
    // Waiting the route handler to complete and then execute
    await next();
    clearHash(req.user.id);
}