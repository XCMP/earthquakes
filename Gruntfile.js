module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';' + grunt.util.linefeed
      },
      libs: {
        src: ['src/libs/jquery.min.js',  'src/libs/handlebars-v4.0.2.js', 'src/libs/backbone-min.js'],
        dest: 'dist/libs.js'
      },
      app: {
        src: ['src/app/earthquakes-app.js', 'src/app/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      css: {
        src: ['src/css/**/*.css'],
        dest: 'dist/<%= pkg.name %>.css'
      },
    },
    
    uglify: {
      options: {
        mangle: false
      },     
      my_target: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.app.dest %>']
        }
      }
    },

    shell: {
      options: {
        stderr: false
      },
      target: {
        command: [
                'echo Compiling Handlebars templates...',
                'handlebars src/hbs/*.hbs -f dist/hbs-templates.js',
                'echo Done. dist/hbs-templates.js created.'
            ].join('&&')
      }
    },

    watch: {
      scripts: {
        files: ['src/**/*.js', 'src/**/*.hbs', 'src/**/*.css'],
        tasks: ['default'],
        options: {
          livereload: true,
          spawn: false
        },
      },
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  grunt.registerTask('default', ['concat', 'uglify', 'shell']);
};