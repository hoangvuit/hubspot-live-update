module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/concat.js',
        dest: 'js/main.min.js'
      }
    },
    concat: {
      js: {
        src: 'js/sources/*.js',
        dest: 'js/concat.js'
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'js/sources/main.js'],
    },
    compass: {
      dist: {
        options: {
          sassDir: 'sass',
          cssDir: 'css',
          environment: 'production'
        }
      }
    },
    shell: {
      upload_js: {
        command: 'sh tasks/upload_js.sh'
      },
      upload_css: {
        command: 'sh tasks/upload_css.sh'
      },
      upload_html: {
        command: 'sh tasks/upload_html.sh'
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      dev: {
        tasks: ['watch:js', 'watch:sass', 'watch:css', 'watch:html']
      }
    },
    watch: {
      js: {
        files: ['js/sources/main.js'],
        tasks: ['jshint', 'concat', 'uglify', 'shell:upload_js'],
      },
      sass: {
        files: ['sass/*.scss'],
        tasks: ['compass'],
      },
      css: {
        files: ['css/*.css'],
        tasks: ['shell:upload_css'],
      },
      html: {
        files: ['html/*.html'],
        tasks: ['shell:upload_html'],
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-shell');

  // Default task(s).
  grunt.registerTask('default', ['concurrent:dev']);
};