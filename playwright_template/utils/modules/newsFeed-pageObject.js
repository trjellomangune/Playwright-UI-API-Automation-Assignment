const { expect } = require("@playwright/test");
const playwright = require("@playwright/test");
const { ENV } = require("../setup/env");
const path = require('path');

const envUtil = new ENV();

class NewsFeedPageObject {
  constructor(page) {
    this.page = page;
    this.section_whatsOnYourMind = `//div[@data-testid="create-post"]`;
    this.textArea_postContent =`//textarea[@data-testid="create-post-content"]`;
    this.button_post = `//button[@data-testid="create-new-post-button"]`;
    this.label_postContent = `//p[@data-testid="news-feed-post-content"]`;
    this.icon_schedule = `//div[@aria-label="Schedule"]`;
    this.input_date = `//input[@placeholder="mm/dd/yyyy"]`;
    this.input_time = `//div[contains(@class, "MuiInputBase-root") and fieldset/legend/span[text()="PH Time"]]//input`;
    this.alert_success = `//div[@class="MuiAlert-message css-1xsto0d"]`;
    this.tab_scheduledPosts = `//button[contains(text(),'Scheduled Posts')]`;
    this.label_scheduledPostContent = `//p[@data-testid="scheduledpost-post-content"]`;
    this.button_attachPhoto = `//div[@aria-label="Attach Photo"]`;
    this.input_mediaFileUpload = `//input[@id="mediaFileUpload"]`;
    this.input_albumTitle = `//div[contains(@class, 'MuiInputBase-root') and contains(@class, 'MuiAutocomplete-inputRoot')]//input[@type='text']`;
    this.button_createAlbum = `//button[@data-testid="new-album-post-button" and (contains(text(), "Create") or contains(text(), "Add"))]`;
    this.image_postedPhoto = `//img[@data-testid="news-feed-post-image"]`;
    this.div_postedPhoto = `//div[@class="aspect-video"]`;
  }

  async createNewsFeedPost(postInput) {
    await this.page.locator(this.section_whatsOnYourMind).click();
    await this.page.locator(this.textArea_postContent).type(postInput);
    await this.page.locator(this.button_post).click();
    await expect(this.page.locator(this.button_post)).toBeHidden();
  }

  async createScheduledNewsFeedPost(postInput, date, time) {
    await this.page.locator(this.section_whatsOnYourMind).click();

    await this.page.locator(this.textArea_postContent).type(postInput);

    await this.page.locator(this.icon_schedule).click();

    await this.page.locator(this.input_date).fill(date);

    await this.page.locator(this.input_date).fill(date);

    await this.page.locator(this.input_time).fill(time);

    await this.page.keyboard.press('ArrowUp');

    await this.page.keyboard.press('Enter');
    
    await this.page.locator(this.button_post).click();
    await expect(this.page.locator(this.button_post)).toBeHidden();
  
  }

  async createNewsFeedPostWithPhoto(postInput, photoPath, albumTitle) {
    await this.page.locator(this.section_whatsOnYourMind).click();
    await this.page.locator(this.textArea_postContent).type(postInput);
    await this.page.locator(this.button_attachPhoto).click();
    // console.log("THIIIIIS IS THE PATH: " + path.join(__dirname, photoPath));
    await this.page.locator(this.input_mediaFileUpload).setInputFiles(path.join(__dirname, photoPath));
    await this.page.locator(this.button_post).click();
    await this.page.locator(this.input_albumTitle).fill(albumTitle);
    await this.page.locator(this.button_createAlbum).focus();
    await this.page.locator(this.button_createAlbum).click();
    
    await expect(this.page.locator(this.button_createAlbum)).toBeHidden();
    
  }
}

module.exports = { NewsFeedPageObject };
