/*global module:false*/
var readFileList = function(path,filesList,str) {
    var fs = require('fs');
    var files = fs.readdirSync(path);
    var ingnor = ['node_modules','bower_components','static'];
    files.forEach(function(itm){
        var stat = fs.statSync(path + itm);
        if (stat.isDirectory() && ingnor.indexOf(itm)===-1) {
            readFileList(path + itm + "/", filesList,str);
        } else {
            if(itm.endsWith(str)){
                var pathItem = path+itm;
                pathItem = pathItem.slice(2);
                filesList.push(pathItem);
            }
        }
    });
    return filesList;
};
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    var mozjpeg = require('imagemin-mozjpeg');
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
          ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        connect: {
          server: {
              options: {
                  port: 8000,
                  base: {
                      path: '.',
                      options: {
                          index: 'index.html',
                          maxAge: 30000
                      }
                  },
                  keepalive: true
              }
          }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['env']
            },
            dist: {
                files: {
                    'lib/app.js': readFileList('./',[],'.js')
                }
            }
        },
          watch:{
              script: {
                  options: {
                      livereload: true,
                      livereloadOnError: false,
                      spawn: false
                  },
                  files: [readFileList('./',[],'.js'),readFileList('./',[],'.css')],
                  tasks: ['csslint','jshint']
              },
              bower: {
                  files:'bower.json',
                  tesks:['wiredep']
              }
          },
        jshint: {
            script: {
                options: {
                    jshintrc: '.jshintrc',
                    reporterOutput:''
                },
                src: readFileList('./',[],'.js')
            }
        },
         csslint: {
            script: {
                options: {
                    csslintrc:'.csslintrc'
                },
                src:readFileList('./',[],'.css')
            }
         },
        wiredep: {
            target: {
                src: ['index.html']
            }
        },
        copy: {
            script: {
                files: [{
                    cwd: 'static/',
                    src: ['**'],
                    dest: "dist/static",
                    expand: true
                }, {
                    src: ['bower_components/**/*'],
                    dest: 'dist/',
                    filter: 'isFile',
                    expand: true
                }]
            }
        },
        imagemin: {
            script: {
                options: {
                    optimizationLevel: 3,
                    svgoPlugins: [{removeViewBox: false}],
                    use: [mozjpeg()]
                },
                files: [{
                    expand: true,
                    cwd: 'dist/static/images',
                    src: ['*.{png,jpg,gif}'],
                    dest: 'dist/static/images'
                }]
            }
        },
        ngtemplates: {
            script: {
                options: {
                    module: 'my-app',
                    htmlmin: '<%= htmlmin.script.options %>'
                },
                // src: ["src/views/**/*.html"],
                src: [readFileList('./src/',[],'.html')],
                dest: 'temp/templates.js'
            }
        },
        htmlmin: {
            script: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                },
                files: {
                    'dist/index.html': 'dist/index.html'
                }
            }
        },
        dom_munger: {
            read: {
                options: {
                    read: [{
                        selector: 'script[data-concat!="false"]',
                        attribute: 'src',
                        writeto: 'appjs'
                    }, {
                        selector: 'link[rel="stylesheet"][data-concat!="false"]',
                        attribute: 'href',
                        writeto: 'appcss'
                    }]
                },
                src: 'index.html'
            },
            update: {
                options: {
                    remove: ['script[data-remove!="false"]', 'link[rel="stylesheet"][data-remove!="false"]'],
                    append: [{
                        selector: 'body',
                        html: '<script src="app.all.min.js"></script>'
                    }, {
                        selector: 'head',
                        html: '<link rel="stylesheet" href="app.all.min.css">'
                    }]
                },
                src: 'index.html',
                dest: 'dist/index.html'
            }
        },
        ngmin: {
            main: {
                src: 'temp/all.js',
                dest: 'temp/all.js'
            }
        },
        concat:{
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            script: {
                src: ['<%= dom_munger.data.appjs %>', '<%= ngtemplates.script.dest %>'],
                dest: 'temp/all.js'
            }
        },
        uglify: {
            main: {
                src: 'temp/all.js',
                dest: 'dist/app.all.min.js'
            }
        },
        cssmin: {
            main: {
                src: ['<%= dom_munger.data.appcss %>'],
                dest: 'dist/app.all.min.css'
            }
        },
        clean: {
            before: {
                src: ['dist', 'temp']
            },
            after: {
                src: ['temp']
            }
        }
        });
    grunt.registerTask('server',['clean:before','wiredep','jshint','csslint','connect','watch']);
    grunt.registerTask('build',['clean:before','jshint','csslint','copy','imagemin','dom_munger','ngtemplates','concat','ngmin','uglify','cssmin','htmlmin','clean:after']);
};
