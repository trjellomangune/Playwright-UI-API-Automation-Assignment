const { expect } = require("@playwright/test");
const playwright = require("@playwright/test");
const { ENV } = require("../setup/env");

const envUtil = new ENV();

class PostLogin {
  constructor(page) {
    this.page = page;
  }

  async login(userToken) {
    const request = await playwright.request.newContext();

    const response = await request.post(`${envUtil.getApiBaseUrl()}/twisthrm/api/v1/user/login`, {
      data: { token: userToken },
    });

    expect(response.status()).toBe(200);
    const responseJson = await response.json();
    expect(responseJson.accessToken).toBeTruthy();

    return responseJson.accessToken;
  }
}

module.exports = { PostLogin };
