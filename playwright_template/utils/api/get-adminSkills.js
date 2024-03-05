const { expect } = require("@playwright/test");
const playwright = require("@playwright/test");
const { ENV } = require("../setup/env");

const envUtil = new ENV();

class GetAdminSkills {
  constructor() {

  }

  async getAdminSkills(hrAccessToken, searchKeyword, page, pageSize, sort) {
    const request = await playwright.request.newContext();

    const response = await request.get(`${envUtil.getApiBaseUrl()}/twisthrm/api/v1/skill?keyword=${searchKeyword}&page=${page}&pageSize=${pageSize}&sort=${sort}`, {
      headers: {
        Authorization: `Bearer ${hrAccessToken}`,
      }
    });

    return response;
  }

  
  
  
}

module.exports = { GetAdminSkills };
