const reactEnv = window.env;

/**
 * Throw the error on missing a required environment variable
 */
const _missingRequiredEnv = (envName) => {
  throw Error(`Missing required environment variable ${envName}`);
};

const requiredEnvs = [
];

/**
 * Class used to handle using environment variables
 */
class ReactEnv {
  constructor() {
    for (let i = 0; i < requiredEnvs.length; i += 1) {
      const envName = requiredEnvs[i];
      if (!reactEnv[envName]) {
        _missingRequiredEnv(envName);
      }
    }
  }

  get dev() {
    return reactEnv.TEST_SIGN_IN === 'true';
  }

  get frontendCommitEndpoint() {
    return reactEnv.REACT_APP_FRONTEND_COMMIT_ENDPOINT;
  }

  get productionServer() {
    return reactEnv.REACT_APP_API_BASE_URL || window.location.origin;
  }

  get devServer() {
      return reactEnv.REACT_APP_TESTING_BASE_URL || window.location.origin;
  }

  get baseURL() {
    return this.dev ? this.devServer : this.productionServer;
  }

  get gitSHA() {
    return reactEnv.GITSHA1;
  }

  get buildNum() {
    return reactEnv.BUILDNUMBER;
  }

  get branchName() {
    return reactEnv.BRANCH;
  }
}

export const env = new ReactEnv();
