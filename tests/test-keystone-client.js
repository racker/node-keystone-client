var async = require('async');

var request = require('rackspace-shared-utils/lib/request').request;
var KeystoneClient = require('../lib/client').KeystoneClient;

exports.test_validateTokenForTenant = function(test, assert) {
  var client = new KeystoneClient('http://127.0.0.1:23542', '2.0');

  async.waterfall([
    function testInexistentTenantId(callback) {
      client.validateTokenForTenant('inexistent', 'foo', function(err, data) {
        assert.ok(err);
        assert.equal(err.statusCode, 501);
        assert.match(err.response.body.reason, /missing user in map auth map/);
        callback();
      });
    },

    function testInvalidToken(callback) {
      client.validateTokenForTenant('7777', 'foo', function(err, data) {
        assert.ok(err);
        assert.equal(err.statusCode, 502);
        assert.match(err.response.body.reason, /invalid token/);
        callback();
      });
    },

    function testValidToken(callback) {
      client.validateTokenForTenant('7777', 'dev', function(err, data) {
        assert.ifError(err);
        assert.ok(data);
        callback();
      });
    }
  ],

  function(err) {
    test.finish();
  });
};
