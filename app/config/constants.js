import path from 'path';
import merge from 'lodash/merge';
import 'dotenv'

// Default configuations applied to all environments
const defaultConfig = {
  env: process.env.NODE_ENV,
  get envs() {
    return {
      test: process.env.NODE_ENV === 'test',
      development: process.env.NODE_ENV === 'development',
      production: process.env.NODE_ENV === 'production',
    };
  },

  version: require('../../package.json').version,
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 4567,
  ip: process.env.IP || '0.0.0.0',
  apiPrefix: '/api', // Could be /api/resource or /api/v2/resource
  userRoles: ['guest', 'user', 'admin'],

  /**
   * MongoDB configuration options
   */
  mongo: {
    seed: true,
    options: {
      db: {
        safe: true,
      },
    },
  },

  /**
   * Security configuation options regarding sessions, authentication and hashing
   */
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'i-am-the-secret-key',
    sessionExpiration: process.env.SESSION_EXPIRATION || 60 * 60 * 24 * 7, // 1 week
    saltRounds: process.env.SALT_ROUNDS || 12,
  },
};

// Environment specific overrides
const environmentConfigs = {
  development: {
    mongo: {
      uri: process.env.MONGO_URI ||'mongodb://localhost/ppeer',
    },
    security: {
      saltRounds: 4,
    },
  },
  test: {
    port: 5678,
    mongo: {
      uri: process.env.MONGO_URI || 'mongodb://localhost/test',
    },
    security: {
      saltRounds: 4,
    },
  },
  production: {
    mongo: {
      seed: false,
      uri: process.env.MONGO_URI,
    },
  },
};

const paymentConfigs = {
  currency : (process.env.NODE_ENV === 'production') ? process.env.WCurrency : process.env.TestWCurrency,
  paymentRequestType : (process.env.NODE_ENV === 'production') ? process.env.WRequestType : process.env.TestWRequestType,
  paymentSiteReference : (process.env.NODE_ENV === 'production') ? process.env.WSiteReference : process.env.TestWSiteReference,
  paymentAccountType : (process.env.NODE_ENV === 'production') ? process.env.WAccountType : process.env.TestWAccountType,
  
  paymentRefundType : (process.env.NODE_ENV === 'production') ? process.env.WRefundType : process.env.TestWRefundType,
  paymentRefundAccountType : (process.env.NODE_ENV === 'production') ? process.env.WRefundAccountType : process.env.TestWRefundAccountType,

  paymentUrl : process.env.paymentUrl,
  paymentUsername : process.env.paymentUsername,
  paymentPass : process.env.paymentPass
}
// Recursively merge configurations
export default merge(defaultConfig, paymentConfigs, environmentConfigs[process.env.NODE_ENV] || {});
