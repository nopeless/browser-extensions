const webpackConfig = require('./webpack.config.js');

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            default: {
                dot: true,
                src: ["production/**/*"]
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
        }
    });
    grunt.loadNpmTasks("grunt-webpack-5");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.registerTask('default', ['clean', 'webpack', 'copy:default']);
};