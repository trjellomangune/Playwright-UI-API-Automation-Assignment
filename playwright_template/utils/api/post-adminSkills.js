const { expect } = require("@playwright/test");
const playwright = require("@playwright/test");
const { ENV } = require("../setup/env");

const envUtil = new ENV();

class PostAdminSkills {
  constructor() {

  }

  async postAdminSkills(hrAccessToken, skillNameInput) {
    const request = await playwright.request.newContext();

    const response = await request.post(`${envUtil.getApiBaseUrl()}/twisthrm/api/v1/skill/create`, {
      headers: {
        Authorization: `Bearer ${hrAccessToken}`,
      },
      data: { name: [skillNameInput] },
    });

    return response;
  }

  
  
  
}

module.exports = { PostAdminSkills };
