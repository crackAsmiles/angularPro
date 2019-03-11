### use angualrJs to build application
#### 前言
#### step1 架构选型
	包管理工具 npm  bower   构建工具  grunt  版本控制工具 git
#### step2 技术选型
	angularJs  bootrap  jquery angular-bootrap-ui
#### step3 开发环境搭建
    1.node 下载安装
            https://nodejs.org/zh-cn/download/
         || https://nodejs.org/en/download/
        命令行 $ node -v   // 查看node版本
    	      $ npm -v   // 查看npm版本
    2.git 下载
        https://www.git-scm.com/download/
        安装以后  在桌面右键 打开 'Git Bash Here'
        配置
           $ git config --global user.name "Your name"
           $ git config --global user.email "Your email"
    2.新建一个文件夹
       $ mkdir angularPro
       $ cd angularPro
    3.初始化项目
       $ npm init   // 根据提示输入 或者一直默认(回车)
       完成以后根目录下面生成 package.json
    4.grunt 安装
        $ npm install grunt-cli -g    // 全局安装grunt-cli
        $ npm install grunt -g        // 全局安装grunt
        $ npm install grunt  --save-dev   // 项目安装grunt并且保存在 package.json中devDependencies中
	    淘宝镜像  npm --registry https://registry.npm.taobao.org install grunt
	    grunt网址：https://www.gruntjs.net/
	5.gruntfile.js 创建
	    可以手动根目录下创建 gruntfile.js
	     懒办法
	   ① git clone https://github.com/gruntjs/grunt-init-gruntfile.git ~/.grunt-init/gruntfile
       ② $ npm install grunt-init --save-dev
       ③ $ grunt-init ~/.grunt-init/gruntfile
          // 根据提示会在根目录下面创建 Gruntfile.js 并把响应的插件的配置写上并且添加到package.json
	6.打开Gruntfile.js 多加了几个插件 但是没有下载
	    $ npm install    // 根据package 里面的dependence 下载包
	7.根据Gruntfilepe 配置 新建几个测试文件 lib/test/test.js  test/test/test.js 执行 grunt default
	    看到多出来 dist文件 并且生成合并压缩的js文件
	8.本地服务  grunt-contrib-connect 插件
	    $ npm install grunt-contrib-connect --save-dev
	    配置：
	    grunt.initConfig ...
        connect: {
              server: {
                  options: {
                      port: 8080,
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
        }
            // 加载 tasks
        grunt.loadNpmTasks('grunt-contrib-connect');

        // connect task
        grunt.registerTask('server',['connect']);

       根目录下新建一个index.html文件
       命令行 ： $ grunt server
       打开浏览器 输入 localhost:8080 查看
    9.开始搭建开发环境
        目的： 提高开发效率 减少时间成本  es6语法转换（需要）
        {
            css：less sass stylus转换，
            js：coffeScript 转换 es6语法转换等，
            代码检测： js语法 css语法，
            自动化：不用手动刷新浏览器
        }
       开始：
        load-grunt-tasks 插件 把grunt插件加载进来不用每次执行grunt.loadNpmTasks('***');
         $ npm install load-grunt-tasks --save-dev

         module.exports = function(grunt){
            require('load-grunt-tasks')(grunt);
         }
        ** css处理
        ** js处理 （es6转换以及语法检测根据个人而定）
         $ npm install --save-dev grunt-babel@7 babel-core babel-preset-env
             babel: {
                 options: {
                     sourceMap: true,
                     presets: ['env']
                 },
                 dist: {
                     files: {
                         'lib/app.js': 'test/app.js'
                     }
                 }
             }
        ** 监听文件变化 自动化概念 自动转义es6以及其
         $ npm install grunt-contrib-watch --save-dev
            watch: {
                build: {
                    files : ['test/app.js']
                }
            }
         ** js语法检测
          $ npm install grunt-contrib-jshint --save-dev
              jshint: {
                   script: {
                       options: {
                           jshintrc: '.jshintrc'
                       },
                       src: ['src/**/*.js','Gruntfile.js']
                   }
              }
        ** css 语法检测
           $ npm install grunt-contrib-csslint --save-dev
                csslint: {
                    script: {
                        options: {
                            csslint:'.csslintrc'
                        },
                        files:['./*.css','src/**/*.css']
                    }
                 }
        ** 自动把bower添加到index.html
            $ npm install grunt-wiredep --save-dev
            修改 index.html
            ``
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <!-- bower:css -->
                    <!-- endbower-->
                    <title>angularPro</title>
                    <!-- bower:js-->
                    <!-- endbower-->
                </head>
                <body>
                    <h1>welcome to angularPr</h1>
                </body>
                </html>
            ``
            Gruntfile.js grunt.initconfig 中新增
            ``
               wiredep: {
                   target: {
                       src: ['index.html']
                   }
               }
            ``  并把 wiredep填在到grunt.registerTask中
        bower下载
            $ npm install bower -g
           初始化  生成 bower.json  今后项目中 bower install 就可以自动下载相应的包
            $ bower init
                根据提示输入  默认一直 enter
        bower下载完成先来下载一个jquery并把文件写入 index.html中
            eg: jquery
            $ bower install jquery --save
            $ grunt server
               看到index.html 中加入jquery的就是js文件
    10.以上就是很基本的  剩下根据项目选用的框架进行相应的grunt包下载 我们用的angularjs
        包下载 （bower）
        $ bower install bootrap --save
        $ bower install angular --save
        $ bower install angular-bootstrap --save
        $ bower install angular-ui-router --save
        注意：bootstrap没有写入 是因为bootstrap的 bower.json 设置有关
        可以在自己的bower.json 设置如下

           "overrides": {
               "bootstrap": {
                 "main": [
                   "dist/js/bootstrap.js",
                   "dist/css/bootstrap.css",
                   "less/bootstrap.less"
                 ]
               }
             }
    11.简单的开发环境搭建以及项目主要的包下载 接下来写一点东西
        简单写了一个页面  。。。


### step 4 打包配置
    打包原则： 文件整合、文件压缩
    *** 文件整合
       ** 静态资源复制（图标、字体等等）
        $ npm install grunt-contrib-copy --save-dev
       ** 图片压缩
        $ npm install grunt-contrib-imagemin --save-dev
       ** 合并文件
        *css js
            $ npm install grunt-contrib-concat --save-dev
        *因为项目基于angular 把template 生成js
            $ npm install grunt-angular-templates --save-dev
        *处理index.html  把非cdn引入的script link属性 写入 js文件  保留cdn引入
            $ npm install grunt-dom-munger --save-dev
         *处理控制依赖问题
            $ npm install grunt-ngmin --save-dev
         *









































	初始化项目
	  $ npm init
	grunt 安装：
	  $ npm install grunt-cli -g
	  $ npm install grunt@0.4.5 -g
	  $ npm install grunt@0.4.5 --save-dev   // devDependencies 开发下 (构建工具 开发工具 测试工具等)   --save  dependencies  生产依赖(插件 等)
	  
	grunt 用于解决问题：
	    一、开发环境搭建
	        1.http服务  直接localhost访问   自动化
            2.代码检测  语法检测
	    二、打包配置
            3.代码压缩  css js html 图片处理
            4.打包  css  js  html
            5.静态资源  外链的js  css  img  font
	  

#### 遇到问题 
	1.grunt插件   grunt-wiredep  自动把bower下载的js css 插入页面html中
	   问题a. 无法插入      原因 ：页面(html要指定注释 即插入的 script link标签位置) 解决 html中添加注释    
	   		<!-- bower:css-->   
	   		<!-- endbower -->
	   		<!-- bower:js -->
	   		<!-- endbower -->
	   问题b.无法插入bootrap   原因 ：bootrap的原因      解决  修改自己的 bower.json文件   添加下面的内容
	   		"overrides": {
			    "bootstrap": {
			      "main": [
			        "dist/js/bootstrap.js",
			        "dist/css/bootstrap.css",
			        "less/bootstrap.less"
			      ]
			    }
			  }
	  问题c： 出现引入错乱问题
	  	会根据 bower.json 的顺序写入到html 自己注意引入的先后顺序
	
    Gruntfile.js 配置
        // 'wrapper'  function 函数
     module.exports = function(grunt){
            // 插件配置
            grunt.initConfig({

            });
            // 加载插件
            grunt.loadNpmTasks('pluginName');

            // 配置任务

            grunt.registerTask('server',['plugin1','...'])

     }
     注意：
        加载插件使用插件   load-grunt-tasks
        eg ;
            require('load-grunt-tasks')(grunt);
            ==== 等价于
            .....
            grunt.loadNpmTasks('pluginName');
	###
	测试grunt-contrib-connect
		grunt.registerTask('connect',['connect']); 不能执行
	 名字不能和其相同
    ****
    包下载font-awesome字体图标的时候 引入css文件不能显示图标
       原因是：版本问题 V4X以及以下 可以 v5版本使用改变 参考 https://fontawesome.com/start

