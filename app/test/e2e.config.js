exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['../app/controllers/descargas.e2e.js'],
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
  },
  multiCapabilities: [{
    browserName: 'firefox'
  }]
};