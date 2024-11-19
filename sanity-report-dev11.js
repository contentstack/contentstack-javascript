const fs = require("fs");
const dotenv = require("dotenv");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

dotenv.config();

const tapHtmlContent = fs.readFileSync("./tap-html.html", "utf8");
const $ = cheerio.load(tapHtmlContent);

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

const slackMessage = {
  text: `Dev11, CDA SDK Full Sanity
*Result:* ${resultMessage}
*Failed Tests:* ${totalFail}
<${reportUrl}|View Report>`,
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
