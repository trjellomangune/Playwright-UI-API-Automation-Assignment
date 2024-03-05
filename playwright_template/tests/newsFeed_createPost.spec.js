const { test, expect } = require("@playwright/test");
const { LoginPageObject } = require("../utils/modules/login-pageObject.js");
// const { PostNewsFeed } = require("../utils/api/post-newsFeed.js");
const { PostLogin } = require("../utils/api/post-login.js");
const { PostScheduledPost } = require("../utils/api/post-scheduledPost.js");
const { NewsFeedPageObject } = require("../utils/modules/newsFeed-pageObject.js");
const playwright = require("@playwright/test");
const { ENV } = require("../utils/setup/env.js");

const testData = require("../test-data/test-data.json");
const testPhoto = "../../test-data/dog.jpg";

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

  test("I should be able to create a scheduled post ", async () => {
    const newsFeedPageObject = new NewsFeedPageObject(page);
    
    await test.step("Given I am on the News Feed Page", async () => {
      await page.goto(envUtil.getBaseUrl());
    });

    await test.step("Create scheduled post content", async () => {
      await newsFeedPageObject.createScheduledNewsFeedPost(
        testData.sampleScheduledNewsFeedPostData.content, 
        testData.sampleScheduledNewsFeedPostData.date,
        testData.sampleScheduledNewsFeedPostData.time
        );
    });

    await test.step("Assert that the success confirmation is displayed", async () => {
      await expect(page.locator(newsFeedPageObject.alert_success)).toBeVisible();
      
      await expect(page.locator(newsFeedPageObject.alert_success))
      .toContainText(testData.sampleScheduledNewsFeedPostData.alertConfirmationMessage);
    });

  });

  test("Scheduled Posts Tab should displayed correctly on the News Feed Page ", async () => {
    const newsFeedPageObject = new NewsFeedPageObject(page);
    
    await test.step("Given I am on the News Feed Page", async () => {
      await page.goto(envUtil.getBaseUrl());
    });

    await test.step("Create scheduled post content", async () => {
      await newsFeedPageObject.createScheduledNewsFeedPost(
        testData.sampleScheduledNewsFeedPostData.content, 
        testData.sampleScheduledNewsFeedPostData.date,
        testData.sampleScheduledNewsFeedPostData.time
        );
    });

    await test.step("I clicked the Scheduled posts tab", async () => {
      await page.locator(newsFeedPageObject.tab_scheduledPosts).click();
    });

    await test.step("Assert the scheduled post is displayed", async () => {
      await expect(page.locator(newsFeedPageObject.label_scheduledPostContent).nth(0)).toBeVisible();
      await expect(page.locator(newsFeedPageObject.label_scheduledPostContent).nth(0))
      .toContainText(testData.sampleScheduledNewsFeedPostData.content);
    });

  });

  test("I should be able to create a text with a photo post", async () => {
    const newsFeedPageObject = new NewsFeedPageObject(page);
    
    await test.step("Given I am on the News Feed Page", async () => {
      await page.goto(envUtil.getBaseUrl());
    });

    await test.step("Create a post with text and photo", async () => {
      await newsFeedPageObject.createNewsFeedPostWithPhoto(
        testData.sampleNewsFeedWithPhotoData.content,
        testPhoto,
        testData.sampleNewsFeedWithPhotoData.albumTitle
        );
    });

    await test.step("Assert the content with photo is posted", async () => {
      await expect(page.locator(newsFeedPageObject.label_postContent).nth(0)).toBeVisible();
      await expect(page.locator(newsFeedPageObject.label_postContent).nth(0)).toContainText(testData.sampleNewsFeedWithPhotoData.content);
      await expect(page.locator(newsFeedPageObject.image_postedPhoto).nth(0)).toBeVisible();
    });

  });

});

test.describe("API Automation", () => {
  let page, envUtil, loginPageObject, context, projectsApi, token, projectId, userMgmtApi, userDetails;

  test.beforeEach(async ({ browser }) => {
    envUtil = new ENV();
  });

  test("Should be able to POST scheduled post to API", async () => {
    const request = await playwright.request.newContext();
    const postLoginApi = new PostLogin();
    const postScheduledPost = new PostScheduledPost();
    let accessToken, response;

    await test.step("Fetch auth token from login api", async () => {
      accessToken = await postLoginApi.login(envUtil.getUserToken());
      console.log(accessToken);
    });

    await test.step("Create news feed post from API", async () => {
      response = await postScheduledPost.postScheduledPost(accessToken,
        testData.sampleScheduledNewsFeedPostData.content,
        testData.sampleScheduledNewsFeedPostData.date,
        testData.sampleScheduledNewsFeedPostData.time);
    });

    await test.step("Assert API response values", async () => {
      expect(response.status()).toBe(200);
      
      const responseJson = await response.json();

      console.log(responseJson);

      expect(responseJson.message).toBe(testData.sampleScheduledNewsFeedPostData.apiConfirmationMessage);
      expect(responseJson.result.firstName).toBe(testData.sampleAccountData.firstName);
      expect(responseJson.result.lastName).toBe(testData.sampleAccountData.lastName);
      expect(responseJson.result.content).toBe(testData.sampleScheduledNewsFeedPostData.content);

      let newDate = postScheduledPost.transformDate(testData.sampleScheduledNewsFeedPostData.date, 
        testData.sampleScheduledNewsFeedPostData.time);
        // console.log("THIS IS THE FORMATTED DATE: " + newDate);
      expect(responseJson.result.postAt).toBe(newDate);
    });

    
  });


});

