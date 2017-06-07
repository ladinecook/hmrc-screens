var fs = require('fs')
var path = require('path')
var test = require('tape')
var sinon = require('sinon')
var cleanup = require('./utils/cleanup')
var buildData = require('../lib/build-data')

test('Create a data file for a new service', function (t) {
  t.plan(1)

  var testDir = path.join(__dirname, 'service')
  var testService = 'test-service'
  var testScenario = 'test-scenario'

  var files = [
    'not-an-image.txt',
    '01-test-image-for-a-test-service.png'
  ]

  var data = {
    'service': testService,
    'last-updated': 'Some date',
    'userjourneys': [{
      'title': testScenario,
      'path': [{
        'caption': 'test image for a test service',
        'imgref': 'images/' + testScenario + '/' + files[1],
        'note': 'Notes go here...'
      }]
    }]
  }

  cleanup(testDir)
  fs.mkdirSync(testDir)

  sinon.stub(console, 'log')

  buildData(files, testDir, testService, testScenario).then(function (filePath) {
    console.log.restore()

    var dataContents = fs.readFileSync(filePath).toString()
    const expectedContents = 'var data = ' + JSON.stringify(data, null, 2)

    t.equal(dataContents, expectedContents, 'with a data object built from args')

    cleanup(testDir)
  })
})
