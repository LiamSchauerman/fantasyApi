module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/lib/jquery.js', 'public/lib/underscore.js', 'public/lib/backbone.js', 'public/lib/handlebars.js', 'public/client/link.js', 'public/client/links.js', 'public/client/linkView.js', 'public/client/createLinkView.js', 'public/client/linksView.js', 'public/client/router.js', 'public/client/app.js' ],
        dest: 'public/dist/concat.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      shabuild: {
        src: 'public/dist/concat.js',
        dest: 'public/dist/concat.min.js'
      }
    },

    jshint: {
      beforeconcat: ['public/lib/jquery.js', 'public/lib/underscore.js', 'public/lib/backbone.js', 'public/lib/handlebars.js', 'public/client/link.js', 'public/client/links.js', 'public/client/linkView.js', 'public/client/createLinkView.js', 'public/client/linksView.js', 'public/client/router.js', 'public/client/app.js'],
      afterconcat: ['public/dist/concat.js'],
      // files: [
      //   // Add filespec list here
      // ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      combine: {
        files: {
          'public/dist/style.min.css': 'public/style.css'
        }
      }

    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      // prodServer: {
      browse: {
        command: 'azure site browse'
      },
      push: {
        command: 'git push azure master'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);
    // grunt.task.run([ 'watch']);
    // grunt.task.run([ 'watch', 'shell:browse']);

  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask( 'build', ['concat', 'uglify', 'cssmin'] );

  grunt.registerTask( 'test', ['jshint', 'mochaTest']);

  grunt.registerTask('deploy', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run(['test', 'build', 'shell:push']);
    } else {
      grunt.task.run(['server-dev']);
    }
  });

};

