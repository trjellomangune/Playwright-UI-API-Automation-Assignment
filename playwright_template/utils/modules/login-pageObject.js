const { expect } = require("@playwright/test");
const playwright = require("@playwright/test");
const { ENV } = require("../setup/env");

const envUtil = new ENV();

class LoginPageObject {
  constructor(page) {
    this.page = page;
  }

  async loginAs(userToken) {
    const token = await this.postLoginAndFetchUserAccessToken(userToken);
    this.page.addInitScript((value) => {
      window.localStorage.setItem("auth-token", value);
    }, token);

    return token;
  }

  async postLoginAndFetchUserAccessToken(userToken) {
    const request = await playwright.request.newContext();

    const response = await request.post(`${envUtil.getApiBaseUrl()}/twisthrm/api/v1/user/login`, { data: { token: userToken } });

    expect(response.status()).toBe(200);
    const responseJSON = await response.json();
    const accessToken = responseJSON.accessToken;

    return accessToken;
  }
}

module.exports = { LoginPageObject };
