const fs = require('fs');
const { App } = require('@slack/bolt');
const { JSDOM } = require("jsdom");
const dotenv = require('dotenv')
const path = require("path");

dotenv.config()

const data = fs.readFileSync(path.join(__dirname, 'tap-html.html'), 'utf8');
const dom = new JSDOM(data);
const report = './tap-html.html'
const textarea = dom.window.document.querySelector("#jest-html-reports-result-data");
const testResults = JSON.parse(textarea.textContent.trim());

const startTime = testResults.startTime;
const endTime = Math.max(...testResults.testResults.map(t => t.perfStats.end));
const totalSeconds = (endTime - startTime) / 1000;
const minutes = Math.floor(totalSeconds / 60);
const seconds = (totalSeconds % 60).toFixed(2);
const duration = `${minutes}m ${seconds}s`;

const summary = {
  totalSuites: testResults.numTotalTestSuites,
  passedSuites: testResults.numPassedTestSuites,
  failedSuites: testResults.numFailedTestSuites,
  totalTests: testResults.numTotalTests,
  passedTests: testResults.numPassedTests,
  failedTests: testResults.numFailedTests,
  skippedTests: testResults.numPendingTests + testResults.numTodoTests,
  pendingTests: testResults.numPendingTests,
  duration: duration,
};

console.log('Total Test Suits:', summary.totalSuites)
console.log('Total Tests:', summary.totalTests);
console.log('Total Pass:', summary.passedTests);
console.log('Total Fail:', summary.failedTests);
console.log('Total Skip:', summary.skippedTests);
console.log('Total Pending:', summary.pendingTests);
console.log('Total Duration:', summary.duration);

const slackMessage = `
*Test Summary of JS Delivery SDK*
• Total Test Suits: *${summary.totalSuites}*
• Total Tests: *${summary.totalTests}*
• Total Pass:: *${summary.passedTests}*
• Total Fail: *${summary.failedTests}*
• Total Skip:: *${summary.skippedTests}*
• Total Pending: *${summary.pendingTests}*
• Total Duration: *${duration}*
`

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})

async function publishMessage (text, report) {
  await app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: process.env.SLACK_CHANNEL,
    text: text
  })
  await app.client.files.uploadV2({
    token: process.env.SLACK_BOT_TOKEN,
    channel_id: process.env.SLACK_CHANNEL_ID,
    initial_comment: '*Here is the report generated*',
    filetype: 'html',
    filename: 'tap-html.html',
    file: fs.createReadStream(report)
  })
}

publishMessage(slackMessage, report)
