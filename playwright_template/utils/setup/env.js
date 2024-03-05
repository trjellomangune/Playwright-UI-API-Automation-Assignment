exports.ENV = class ENV {
  baseUrl = "";

  apiBaseUrl = "";

  httpCredentialsUsername = "";
  httpCredentialsPassword = "";

  userToken = "";

  constructor() {
    this.baseUrl = process.env.BASE_URL || "";

    this.apiBaseUrl = process.env.API_BASE_URL || "";

    this.httpCredentialsUsername = process.env.HTTP_CREDENTIALS_USERNAME || "";
    this.httpCredentialsPassword = process.env.HTTP_CREDENTIALS_PASSWORD || "";

    this.userToken = process.env.USER_TOKEN || "";
    this.hrToken = process.env.HR_TOKEN || "";
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  getApiBaseUrl() {
    return this.apiBaseUrl;
  }

  getHttpCredentialsUsername() {
    return this.httpCredentialsUsername;
  }

  getHttpCredentialsPassword() {
    return this.httpCredentialsPassword;
  }

  getUserToken() {
    return this.userToken;
  }

  getHrToken() {
    return this.hrToken;
  }
};
