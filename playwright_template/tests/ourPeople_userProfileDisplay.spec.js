const { test, expect } = require("@playwright/test");
const { LoginPageObject } = require("../utils/modules/login-pageObject.js");
const { PostLogin } = require("../utils/api/post-login.js");
const { PostAdminSkills } = require("../utils/api/post-adminSkills.js");
const { GetEmployee } = require("../utils/api/get-employee.js");
const playwright = require("@playwright/test");
const { ENV } = require("../utils/setup/env.js");

const testData = require("../test-data/test-data.json");

test.describe("API Automation", () => {
  let page, envUtil, loginPageObject, context, projectsApi, token, projectId, userMgmtApi, userDetails;

  test.beforeEach(async ({ browser }) => {
    envUtil = new ENV();
  });

  test.only("Should be able to fetch a specific employee using a valid token", async () => {
    const request = await playwright.request.newContext();
    const postLoginApi = new PostLogin();
    const getEmployeeApi = new GetEmployee();
    let accessToken, response;

    await test.step("Fetch auth token from login api", async () => {
      accessToken = await postLoginApi.login(envUtil.getUserToken());
      console.log("ACCESS TOKEN HERE: " + accessToken);
    });

    await test.step("Fetch Employee based on employeeNumber from API", async () => {
      response = await getEmployeeApi.getEmployee(accessToken, 
        testData.sampleEmployeeData.employeeNumber);
    });

    await test.step("Assert API response values", async () => {
      expect(response.status()).toBe(200);
      
      const responseJson = await response.json();

      console.log(responseJson);

      expect(responseJson[0].systemId).toBe(testData.sampleEmployeeData.employeeNumber);
      
    });

    
  });
  

});
