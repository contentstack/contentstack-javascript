module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  forceExit:true,
  reporters: [
    "default",
    ["jest-html-reporters", 
      {
        "publicPath": "./html-report",
        "filename": "report.html",
        "expand": true
      }
    ]
  ]
};