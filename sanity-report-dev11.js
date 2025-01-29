const fs = require("fs");
const { JSDOM } = require("jsdom");
const dotenv = require("dotenv");

dotenv.config();

const user1 = process.env.USER1;
const user2 = process.env.USER2;
const user3 = process.env.USER3;
const user4 = process.env.USER4;

const tapHtmlContent = fs.readFileSync("./tap-html.html", "utf8");
const dom = new JSDOM(tapHtmlContent);
const $ = require("jquery")(dom.window);

const totalCount = $(".nav a:nth-child(2)")
  .text()
  .trim()
  .replace("Total Count", "");
const totalPass = $(".nav a:nth-child(3)")
  .text()
  .trim()
  .replace("Total Pass", "");
const totalFail = $(".nav a:nth-child(4)")
  .text()
  .trim()
  .replace("Total Fail", "");

const totalTime = $(".nav a:nth-child(1)")
  .text()
  .trim()
  .replace("Total Time", "");

const milliseconds = parseInt(totalTime.replace(/\D/g, ''), 10);
const totalSeconds = Math.floor(milliseconds / 1000);
const durationInMinutes = Math.floor(totalSeconds / 60);
const durationInSeconds = totalSeconds % 60;

const passedTests = parseInt(totalPass, 10);
const totalTests = parseInt(totalCount, 10);

const resultMessage =
  passedTests === totalTests
    ? `:white_check_mark: Success (${passedTests} / ${totalTests} Passed)`
    : `:x: Failure (${passedTests} / ${totalTests} Passed)`;

const pipelineName = process.env.GO_PIPELINE_NAME;
const pipelineCounter = process.env.GO_PIPELINE_COUNTER;
const goCdServer = process.env.GOCD_SERVER;

const reportUrl = `http://${goCdServer}/go/files/${pipelineName}/${pipelineCounter}/sanity/1/sanity/test-results/tap-html.html`;

let tagUsers = ``;
if (totalFail > 0) {
  tagUsers = `<@${user1}> <@${user2}> <@${user3}> <@${user4}>`;
}

const slackMessage = {
  text: `Dev11, CDA SDK Full Sanity
*Result:* ${resultMessage}. ${durationInMinutes}m ${durationInSeconds}s
*Failed Tests:* ${totalFail}
<${reportUrl}|View Report>
${tagUsers}`,
};

const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

const sendSlackMessage = async (message) => {
  const payload = {
    text: message,
  };

  try {
    const response = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error sending message to Slack: ${response.statusText}`);
    }

    console.log("Message sent to Slack successfully");
  } catch (error) {
    console.error("Error:", error);
  }
};

sendSlackMessage(slackMessage.text);