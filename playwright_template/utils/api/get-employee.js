const { expect } = require("@playwright/test");
const playwright = require("@playwright/test");
const { ENV } = require("../setup/env");

const envUtil = new ENV();

class GetEmployee {
  constructor() {

  }

  async getEmployee(accessToken, employeeNumber) {
    const request = await playwright.request.newContext();

    const response = await request.get(`${envUtil.getApiBaseUrl()}/twisthrm/api/v1/employee/${employeeNumber}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    return response;
  }

  
  
  
}

module.exports = { GetEmployee };
