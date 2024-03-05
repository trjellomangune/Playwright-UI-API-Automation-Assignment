const { test, expect } = require("@playwright/test");
const { LoginPageObject } = require("../utils/modules/login-pageObject");
const { PostNewsFeed } = require("../utils/api/post-newsFeed.js");
const { PostLogin } = require("../utils/api/post-login.js");
const { NewsFeedPageObject } = require("../utils/modules/newsFeed-pageObject");
const playwright = require("@playwright/test");
const { ENV } = require("../utils/setup/env");

const testData = require("../test-data/test-data.json");

test.describe("UI Automation", () => {
  let page, envUtil, loginPageObject, context, projectsApi, token, projectId, userMgmtApi, userDetails;

  test.beforeEach(async ({ browser }) => {
    envUtil = new ENV();

    context = await browser.newContext({
      httpCredentials: {
        username: envUtil.getHttpCredentialsUsername(),
        password: envUtil.getHttpCredentialsPassword(),
      },
      //   viewport: { width: 1920, height: 1080 },
    });
    page = await context.newPage();

    loginPageObject = new LoginPageObject(page);

    token = await loginPageObject.loginAs(envUtil.getUserToken());
  });

  test("Clicking on the Header Buttons", async () => {
    const button_newsFeed = `//div[@aria-label="News Feed"]`;
    const button_photos = `//div[@aria-label="Photos"]`;
    const button_videos = `//div[@aria-label="Videos"]`;
    const button_ourPeople = `//div[@aria-label="Our People"]`;
    const button_admin = `//div[@aria-label="Admin"]`;
    const button_pim = `//div[@aria-label="PIM"]`;
    
    await test.step("Given I am on the News Feed Page", async () => {
      await page.goto(envUtil.getBaseUrl());
    });

    await test.step("Clicking on the header buttons", async () => {
      await page.locator(button_photos).click();
      await page.pause();

      await page.locator(button_videos).click();
      await page.pause();

      await page.locator(button_ourPeople).click();
      await page.pause();
      
      await page.locator(button_admin).click();
      await page.pause();

      await page.locator(button_pim).click();
      await page.pause();

      await page.locator(button_newsFeed).click();
      await page.pause();

    });

    await page.pause();
  });

  test("Accessing pages via URL", async () => {
    const url_newsFeed = `${envUtil.getBaseUrl()}/news-feed`;
    const url_photos = `${envUtil.getBaseUrl()}/photos`;
    const url_videos = `${envUtil.getBaseUrl()}/videos`;
    const url_ourPeople = `${envUtil.getBaseUrl()}/our-people`;
    const url_admin = `${envUtil.getBaseUrl()}/admin`;
    const url_pim = `${envUtil.getBaseUrl()}/personnel-information-management`;
    
    await test.step("Given I am on the News Feed Page", async () => {
      await page.goto(envUtil.getBaseUrl());
    });

    await test.step("Accessing pages via URL", async () => {
      await page.goto(url_photos);
      await page.pause();

      await page.goto(url_videos);
      await page.pause();

      await page.goto(url_ourPeople);
      await page.pause();

      await page.goto(url_admin);
      await page.pause();

      await page.goto(url_pim);
      await page.pause();

      await page.goto(url_newsFeed);
      await page.pause();
    });

    await page.pause();
  });

  test("Handling inputs", async () => {
    const section_whatsOnYourMind = `//div[@data-testid="create-post"]`;
    const textArea_postContent =`//textarea[@data-testid="create-post-content"]`;
    const button_post = `//button[@data-testid="create-new-post-button"]`;
    const label_postContent = `//p[@data-testid="news-feed-post-content"]`;
    
    await test.step("Given I am on the News Feed Page", async () => {
      await page.goto(envUtil.getBaseUrl());
    });

    await test.step("Display the create post modal", async () => {
      await page.locator(section_whatsOnYourMind).click();
    });

    await test.step("Type a newsfeed content", async () => {
      await page.locator(textArea_postContent).type("This is Jello's Test Post");
    });

    await test.step("click the post button", async () => {
      await page.locator(button_post).click();
      await expect(page.locator(button_post)).toBeHidden();
    });

    await test.step("Assert the posted news feed content", async () => {
      await expect(page.locator(label_postContent).nth(0)).toBeVisible();
      await expect(page.locator(label_postContent).nth(0)).toContainText("This is Jello's Test Post");
    });

  });

  test("Taking screenshots", async () => {
    const section_whatsOnYourMind = `//div[@data-testid="create-post"]`;
    const textArea_postContent =`//textarea[@data-testid="create-post-content"]`;
    const button_post = `//button[@data-testid="create-new-post-button"]`;
    const label_postContent = `//p[@data-testid="news-feed-post-content"]`;
    
    await test.step("Given I am on the News Feed Page", async () => {
      await page.goto(envUtil.getBaseUrl());
    });

    await test.step("Display the create post modal", async () => {
      await page.locator(section_whatsOnYourMind).click();
    });

    await test.step("Type a newsfeed content", async () => {
      await page.locator(textArea_postContent).type("This is Jello's Test Post");
    });

    await test.step("click the post button", async () => {
      await page.locator(button_post).click();
      await expect(page.locator(button_post)).toBeHidden();
    });

    await test.step("Assert the posted news feed content", async () => {
      await expect(page.locator(label_postContent).nth(0)).toBeVisible();
      await expect(page.locator(label_postContent).nth(0)).toContainText("This is Jello's Test Post");
    });

    await page.screenshot({ path: `./screenshots/screenshot.png` });
  });

  test("Utilizing Page Object Model", async () => {
    const newsFeedPageObject = new NewsFeedPageObject(page);
    
    await test.step("Given I am on the News Feed Page", async () => {
      await page.goto(envUtil.getBaseUrl());
    });

    await test.step("Create post content", async () => {
      await newsFeedPageObject.createNewsFeedPost(testData.sampleInput);
    });

    await test.step("Assert the posted news feed content", async () => {
      await expect(page.locator(newsFeedPageObject.label_postContent).nth(0)).toBeVisible();
      await expect(page.locator(newsFeedPageObject.label_postContent).nth(0)).toContainText(testData.sampleInput);
    });

    await page.screenshot({ path: `./screenshots/screenshot.png` });
  });

});


test.describe("API Automation", () => {
  let page, envUtil, loginPageObject, context, projectsApi, token, projectId, userMgmtApi, userDetails;

  test.beforeEach(async ({ browser }) => {
    envUtil = new ENV();
  });

  test("Validating Responses", async () => {
    const request = await playwright.request.newContext();
    const postLoginApi = new PostLogin();
    let accessToken;

    await test.step("Fetch auth token from login api", async () => {
      accessToken = await postLoginApi.login(envUtil.getUserToken());
      console.log(accessToken);
    });

    await test.step("Create news feed post from API", async () => {
      const response = await request.post(`${envUtil.getApiBaseUrl()}/twisthrm/api/v1/new-newsfeed/create`, {  
        headers: {Authorization : `Bearer ${accessToken}`}, 
        data: {content: "test1234567", groupId: "development", postType: "standard"}
      });

      expect(response.status()).toBe(200);
    });

    
  });

  test("Creating news feed post via API", async () => {
    const request = await playwright.request.newContext();
    const postLoginApi = new PostLogin();
    let accessToken, response;

    await test.step("Fetch auth token from login api", async () => {
      accessToken = await postLoginApi.login(envUtil.getUserToken());
      console.log(accessToken);
    });

    await test.step("Create news feed post from API", async () => {
      response = await request.post(`${envUtil.getApiBaseUrl()}/twisthrm/api/v1/new-newsfeed/create`, {  
        headers: {Authorization : `Bearer ${accessToken}`}, 
        data: {content: "sample", groupId: "development", postType: "standard"}
      });
    });

    await test.step("Assert API response values", async () => {
      expect(response.status()).toBe(200);
      
      const responseJson = await response.json();

      console.log(responseJson);

      expect(responseJson.message).toBe("Successfully created post");
      expect(responseJson.result.firstName).toBe("Jello");
      expect(responseJson.result.lastName).toBe("MANGUNE");
      expect(responseJson.result.content).toBe("sample");
    });

    
  });

  test("Utilizing page object model for API", async () => {
    const request = await playwright.request.newContext();
    const postLoginApi = new PostLogin();
    const postNewsFeedApi = new PostNewsFeed();
    let accessToken, response;

    await test.step("Fetch auth token from login api", async () => {
      accessToken = await postLoginApi.login(envUtil.getUserToken());
      console.log(accessToken);
    });

    await test.step("Create news feed post from API", async () => {
      response = await postNewsFeedApi.postNewsFeed(accessToken, "sample");
    });

    await test.step("Assert API response values", async () => {
      expect(response.status()).toBe(200);
      
      const responseJson = await response.json();

      console.log(responseJson);

      expect(responseJson.message).toBe("Successfully created post");
      expect(responseJson.result.firstName).toBe("Jello");
      expect(responseJson.result.lastName).toBe("MANGUNE");
      expect(responseJson.result.content).toBe("sample");
    });

    
  });

  

});
