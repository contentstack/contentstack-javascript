module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  forceExit:true,
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest"
  },
  reporters: [
    "default",
    ["jest-html-reporters", 
      {
        "publicPath": "./typescript-html-report",
        "filename": "report.html",
        "expand": true
      }
    ]
  ],
};