const fs = require('fs');
const Slack = require('@slack/bolt')
const dotenv = require('dotenv')
dotenv.config()

const cheerio = require('cheerio');
const tapHtmlContent = fs.readFileSync('./tap-html.html', 'utf8');
const report = `./tap-html.html`
const $ = cheerio.load(tapHtmlContent);

const totalTime = $('.nav a:nth-child(1)').text().trim().replace('Total Time', '');
const totalCount = $('.nav a:nth-child(2)').text().trim().replace('Total Count', '');
const totalPass = $('.nav a:nth-child(3)').text().trim().replace('Total Pass', '');
const totalFail = $('.nav a:nth-child(4)').text().trim().replace('Total Fail', '');
const totalSkip = $('.nav a:nth-child(5)').text().trim().replace('Total Skip', '');
const totalTodo = $('.nav a:nth-child(6)').text().trim().replace('Total Todo', '');

const milliseconds = parseInt(totalTime.replace(/\D/g, ''), 10);
const totalSeconds = Math.floor(milliseconds / 1000);
const durationInMinutes = Math.floor(totalSeconds / 60);
const durationInSeconds = totalSeconds % 60;

console.log('Total Test Suits:', '9')
console.log('Total Tests:', totalCount);
console.log('Total Pass:', totalPass);
console.log('Total Fail:', totalFail);
console.log('Total Skip:', totalSkip);
console.log('Total Pending:', totalTodo);
console.log('Total Duration:', `${durationInMinutes}m`,`${durationInSeconds.toFixed(2)}s`);

const slackMessage = `
*Test Summary of JS Delivery SDK*
• Total Test Suits: *9*
• Total Tests: *${totalCount}*
• Total Pass:: *${totalPass}*
• Total Fail: *${totalFail}*
• Total Skip:: *${totalSkip}*
• Total Pending: *${totalTodo}*
• Total Duration: *${durationInMinutes}m ${durationInSeconds}s*
`

const app = new Slack.App({
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
