'use strict';

let request = require('request'),
    path = require('path'),
    fs = require('fs'),
    exec = require('child_process').exec,
    nodemailer = require('nodemailer'),
    config = require('./config.js'),
    reportFileName = "report.json";

//configure the smtp 
let transporter = nodemailer.createTransport(config.smtp);

let automation = function() {
    let self = this;
    console.log("-----automation started ------")
    self.init();
    self.run();
}

automation.prototype.init = function() {
    try {
        let self = this;

       // initalise the runscope config
        let options = {
            method: "POST",
            url: config.runscope.url,
            qs: {
                "url": config.url,
                "username": config.runscope.username,
                "password": config.runscope.password,
                "api_key": config.stack.api_key,
                "delivery_token": config.stack.delivery_token,
                "Content-Type": "application/json"
            }
        };
        console.log("Creating data in Contentstack...");

        // trigger runscope url for data creation in Contentstack
        request(options, function(err, res, body) {
            if (!err && body) {
                setTimeout(function() {
                    console.log("Data created in Contentstack...");
                    self.run();
                }, 240000);
            }
        });
    } catch (err) {
        console.error("Init error: ", err.message || err);
        process.exit(0);
    }
}

automation.prototype.run = function() {
    let self = this;
    let _path = path.join(process.cwd(), 'test');
    //change directory to run "node index.js | tap-json > report.json" command
    process.chdir(_path);
    // run command "node index.js" to run the test cases
    console.log("Running the test cases....");
    // let executeCommand = "node index.js";
    let executeCommand = "node index.js | tap-html > " + reportFileName;
    exec(executeCommand, function(err, stdout, stderr) {
        if (!err) {
            console.log("Test cases runned successfully....");
            self.sendMail();
        } else {
            console.error("error: ", err.message || err)
        }
    });
};

automation.prototype.sendMail = function() {
    console.log("Mailing report....");
    let reportPath = path.join(__dirname, '../', 'test', reportFileName);
    if (fs.existsSync(reportPath)) {
        let message = {
            from: 'aamod.pisat@raweng.com',
            to: 'aamod.pisat@raweng.com',
            subject: 'Report of JS SDK test cases | ' + new Date(),
            html: '<p>Hi Team, Please check below attachment of test cases report.</p>',
            attachments: [{
                filename: "reports.json",
                path: reportPath
            }]
        };

        transporter.sendMail(message, function(err, info) {
            if (!err) {
                console.log("Report mailed successfully !!!");
                console.log("-----automation finished ------")
            }
        });

        transporter.close();
    } else {
        console.error("Error: Sorry report don't exist");
    }
};

module.exports = automation;