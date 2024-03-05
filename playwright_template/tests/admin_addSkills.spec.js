const { test, expect } = require("@playwright/test");
const { LoginPageObject } = require("../utils/modules/login-pageObject");
const { PostLogin } = require("../utils/api/post-login.js");
const { PostAdminSkills } = require("../utils/api/post-adminSkills.js");
const { GetAdminSkills } = require("../utils/api/get-adminSkills.js");
const playwright = require("@playwright/test");
const { ENV } = require("../utils/setup/env");

const testData = require("../test-data/test-data.json");

test.describe("API Automation", () => {
  let page, envUtil, loginPageObject, context, projectsApi, token, projectId, userMgmtApi, userDetails;

  test.beforeEach(async ({ browser }) => {
    envUtil = new ENV();
  });


  test("should be able to add skills upon passing valid token", async () => {
    const request = await playwright.request.newContext();
    const postLoginApi = new PostLogin();
    const postAdminSkillsApi = new PostAdminSkills();
    let accessToken, response;

    await test.step("Fetch auth token from login api", async () => {
      accessToken = await postLoginApi.login(envUtil.getUserToken());
      console.log("ACCESS TOKEN HERE: " + accessToken);
    });

    await test.step("Create admin skill post from API", async () => {
      response = await postAdminSkillsApi.postAdminSkills(accessToken, testData.sampleSkillData.skillName);
    });

    await test.step("Assert API response values", async () => {
      expect(response.status()).toBe(200);
      
      const responseJson = await response.json();

      console.log(responseJson);

      expect(responseJson.message).toBe("Successfully saved!");
      expect(responseJson.affectedRows).toBe(1);
    });

    
  });

  test.only("Search result must be related to the search keyword", async () => {
    const request = await playwright.request.newContext();
    const postLoginApi = new PostLogin();
    const getAdminSkillsApi = new GetAdminSkills();
    let accessToken, response;

    await test.step("Fetch auth token from login api", async () => {
      accessToken = await postLoginApi.login(envUtil.getUserToken());
      console.log("ACCESS TOKEN HERE: " + accessToken);
    });

    await test.step("Fetch skill based on they keyword from APII", async () => {
      response = await getAdminSkillsApi.getAdminSkills(accessToken, 
        testData.sampleSearchSkillData.skillName,
        testData.sampleSearchSkillData.page,
        testData.sampleSearchSkillData.pageSize,
        testData.sampleSearchSkillData.sort);
    });

    await test.step("Assert API response values", async () => {
      expect(response.status()).toBe(200);
      
      const responseJson = await response.json();

      console.log(responseJson);

      for (const skill of responseJson.skills) {
        expect(skill.name.toLowerCase()).toContain(testData.sampleSearchSkillData.skillName.toLowerCase());
        expect(skill.isDeleted).toBe(0);
      }

      expect(responseJson.page).toBe(testData.sampleSearchSkillData.page);
      expect(responseJson.pageSize).toBe(testData.sampleSearchSkillData.pageSize);
      
    });

    
  });
  

});
