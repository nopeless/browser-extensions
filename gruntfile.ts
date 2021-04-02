const webpackConfig = require('./webpack.config.js');

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            default: {
                dot: true,
                src: ["production/**/*"]
            },
            cleanup: {
                src: ["production/assets/stylesheet.min.js"]
            },
        },
        webpack: {
            prod: webpackConfig,
            dev: webpackConfig
        },
        copy: {
            default: {
                files: [
                    {
                        nonull: true,
                        src: 'src/manifest.json',
                        dest: 'production/manifest.json',
                    },
                    {
                        nonull: true,
                        expand: true,
                        src: '**',
                        cwd: 'src/_locales/',
                        dest: 'production/_locales/',
                    }, {
                        nonull: true,
                        src: 'src/frontend/popup/index.html',
                        dest: 'production/popup.html',
                    }
                ]
            }
        },
        compress: {
            default: {
                options: {
                    archive: 'dist/<%= pkg.version %>.zip',
                    mode: 'zip'
                },
                files: [
                    {
                        dot: true,
                        src: '**/*',
                        expand: true,
                        cwd: 'production/'
                    }
                ]
            }
        },
        uglify: {
            default: {
                files: [{
                    expand: true,
                    cwd: 'production/assets',
                    src: '**/*.js',
                    dest: 'production/assets'
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-webpack-5");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.registerTask('default', ['clean:default', 'webpack', 'copy:default', 'uglify:default', 'clean:cleanup']);
};