var pluginPath = '../index';
var plugin = require(pluginPath);
var chai = require('chai');
var path = require('path');
var expect = chai.expect;
var gutil = require('gulp-util');
var fs = require('fs');

// var proxyquire = require('proxyquire');
// var sinon = require('sinon');
// var gutil = require('gulp-util');

var getFixtureFile = function (path) {
  return new gutil.File({
    path: './test/fixtures/' + path,
    cwd: './test/',
    base: './test/fixtures/',
    contents: fs.readFileSync('./test/fixtures/' + path)
  });
};

describe('gulp-pug-inheritance', function(done) {
  it('pug with parents', function(done) {
    var fixture = getFixtureFile('fixture1.pug');

    var fileNames = [
      path.join('test', 'fixtures', 'fixture1.pug'),
      path.join('test', 'fixtures', 'fixture2.pug'),
      path.join('test', 'fixtures', 'fixture3.pug'),
    ];

    var files = [];

    var stream = plugin({extension: '.pug'});
    stream
      .on('data', function (file) {
        expect(fileNames).to.include(file.relative);

        files.push(file);
      })
      .once('end', function() {
        expect(files).to.have.length(3);

        done();
      });

    stream.write(fixture);
    stream.end();
  });

  it('pug without parents', function(done) {
    var fixture = getFixtureFile('fixture4.pug');

    var files = [];

    var stream = plugin({extension: '.pug'});
    stream
      .on('data', function (file) {
        files.push(file);
      })
      .once('end', function() {
        expect(files).to.have.length(1);

        done();
      });

    stream.write(fixture);
    stream.end();
  });

  it('empty pug', function(done) {
    var fixture = getFixtureFile('fixture5.pug');

    var files = [];

    var stream = plugin({extension: '.pug'});
    stream
      .on('data', function (file) {
        files.push(file);
      })
      .once('end', function() {
        expect(files).to.have.length(0);

        done();
      });

    stream.write(fixture);
    stream.end();
  });

  describe('custom basedir', function(done) {
    it('wrong path', function(done) {
      var fixture = getFixtureFile('fixture1.pug');

      var files = [];

      var stream = plugin({basedir: 'test/fixtures5', extension: '.pug'});
      stream
        .on('data', function (file) {
          files.push(file);
        })
        .once('end', function() {
          expect(files).to.have.length(1);

          done();
        });

      stream.write(fixture);
      stream.end();
    });

    it('valid path', function(done) {
      var fixture = getFixtureFile('fixture1.pug');

      var files = [];

      var stream = plugin({basedir: 'test/fixtures', extension: '.pug'});
      stream
        .on('data', function (file) {
          files.push(file);
        })
        .once('end', function() {
          expect(files).to.have.length(3);

          done();
        });

      stream.write(fixture);
      stream.end();
    });
  });

  it('subfolder pug', function(done) {
    var fixture = getFixtureFile('subfolder/fixture5.pug');

    var files = [];

    var stream = plugin({basedir: 'test/fixtures', extension: '.pug'});
    stream
      .on('data', function (file) {
        expect(file.base).to.be.eql('test/fixtures');
        files.push(file);
      })
      .once('end', function() {
        expect(files).to.have.length(1);

        done();
      });

    stream.write(fixture);
    stream.end();
  });
});
