const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
// Using util.promisify to promisify client.ge  t function so that we can handle this function like promise and not callbacks
// assigning promisified function to current client.get, makes the function to return a promise 
client.hget = util.promisify(client.hget);

// Assigning default exec function of mongoose.Query to a new value so that we can reuse it 
const exec = mongoose.Query.prototype.exec;

/**
 * Creating a new function cache() into the mongoose.Query prototype so that we can use it when we make a query
 * Assignes useCache as true and hashKey that is an argument of the function
 * @param {Object} [options]
 * @return {Query} [this]
 * */ 
mongoose.Query.prototype.cache = function (options = {}) {
    // assigning to mongoose.Query(which is this) the property useCache
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    // we return this to make it chainable
    // for e.x we could call Blog.find({_ user: userId }).cache().limit().sort()
    return this;
}
/**
 * Overrides default exec function
 * exec() is invoked everytime we do a query using mongoose
 */
mongoose.Query.prototype.exec = async function () {
    // Checks if useCache() is provided in Query, if no runs the default exec functions
    if (!this.useCache) {
        return exec.apply(this, arguments)
    }
    // Creates the key that is a stringified object containing the query and the collectionName
    const key = JSON.stringify(Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name }));
    // Check if we have a value for 'key' in redis
    const cacheValue = await client.hget(this.hashKey, key);
    // If we do, return that value
    if (cacheValue) {
        const doc = JSON.parse(cacheValue);
        /**
         * Because we stringify the exec.apply result and then we enter that value to redis
         * We have to create a new query model of that value, so that it can be in the right format that mongoose needs: Model {.....}
         * Here we chefck if it an array, so that we have to map through array and create a new array of new Models
         * or is just a single object and return it
         */
        return Array.isArray(doc) 
            ? doc.map(d => new this.model(d))
            : new this.model(doc);
    }
    // Otherwise, issue the query and store the result in redis 
    const result = await exec.apply(this, arguments);
    client.hset(this.hashKey, key, JSON.stringify(result));
    return result;
}

/**
 * Deletes from redis the values for that hashKey
 * @module exports clearHash()
 * @param {number} [hashKey]
 */
module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};