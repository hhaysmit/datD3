module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch:{
      js:{
        files: 
          ['dist/index.js', 'src/groupedHistogram.js'],
        tasks:
        ['uglify']
      }
    },
    browserify: {
      'dist/index.js': ['src/index.js']
    },
    uglify: {
      build: {
        files:{
          'dist/index.min.js':['dist/index.js']
        }
      }
    },
  });
  require('load-grunt-tasks')(grunt)
  grunt.registerTask('default', ['browserify', 'uglify']);

};