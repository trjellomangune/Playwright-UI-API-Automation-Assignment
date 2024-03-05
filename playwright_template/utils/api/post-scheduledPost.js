const { expect } = require("@playwright/test");
const playwright = require("@playwright/test");
const { ENV } = require("../setup/env");

const envUtil = new ENV();

class PostScheduledPost {
  constructor() {

  }

  async postScheduledPost(accessToken, contentInput, scheduledDate, scheduledTime) {
    const request = await playwright.request.newContext();

    const response = await request.post(`${envUtil.getApiBaseUrl()}/twisthrm/api/v1/scheduled-post/create`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: { content: contentInput, groupId: "staging", postType: "standard", 
      postAt: scheduledDate, postAtTime: scheduledTime, timeZone: "Asia/Manila"},
    });

    return response;
  }

  transformDate(inputDate, inputTime) {
    // Split date and time
    var dateParts = inputDate.split("/");
    var timeParts = inputTime.split(":");
    
    // Create a new Date object
    var formattedDate = new Date(dateParts[2], dateParts[0] - 1, dateParts[1], timeParts[0], timeParts[1].split(" ")[0]);
    
    // Convert to UTC string format
    var utcDateString = formattedDate.toISOString();

    // Return the formatted date
    return utcDateString;
  }
  
  
}

module.exports = { PostScheduledPost };
