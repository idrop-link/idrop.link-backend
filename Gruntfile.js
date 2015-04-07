(function() {
    'use strict';

    module.exports = function(grunt) {

        grunt.initConfig({
            paths: {
                js: ['*.js', 'models/**/*.js', 'api/**/*.js', 'test/*.js', 'config/*.js']
            },

            jshint: {
                src: '<%= paths.js %>'
            },

            jsbeautifier: {
                beautify: {
                    src: '<%= paths.js %>'
                },
                check: {
                    src: '<%= paths.js %>',
                    options: {
                        mode: 'VERIFY_ONLY'
                    }
                }
            },

            watch: {
                js: {
                    files: '<%= paths.js %>',
                    tasks: ['jshint']
                }
            }
        });

        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-jsbeautifier');

        grunt.registerTask('default', ['jshint', 'jsbeautifier:check']);
        grunt.registerTask('beautify', ['jsbeautifier:beautify']);
    };
})();
