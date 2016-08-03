/**
 * Created by Edo on 01/08/2016.
 */
var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var vinylSourceStream = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var sass = require("gulp-sass");
var rm = require('gulp-rimraf');
var gulpConcat = require("gulp-concat");
var gulpUglify = require("gulp-uglify");
var gulpRename = require("gulp-rename");
var spawn = require("child_process").spawn;
var autoReload = require("gulp-auto-reload");
var gutil = require("gulp-util");

// Load all gulp plugins into the plugins object.
var plugins = require('gulp-load-plugins')();

var src = {
    sass: 'public/stylesheets/**/*.scss',
    scripts: {
        all: 'public/js/**/*.js',
        app: 'public/js/app.js'
    },
    server: "server/**/*.js",
    lib: {
        all: [
            "node_modules/jquery/dist/jquery.js",
            "node_modules/angular/angular.js",
            "node_modules/bootstrap/dist/js/bootstrap.js",
            "node_modules/angular-cookies/angular-cookies.js",
            "node_modules/angular-resource/angular-resource.js",
            "node_modules/angular-ui-router/release/angular-ui-router.js",
            "node_modules/angular-sanitize/angular-sanitize.js"
        ]
    }
};

var build = 'build/',
    reloader = null,
    node = null;
var out = {
    sass: {
        folder: build + 'css/'
    },
    scripts: {
        file: 'app.min.js',
        folder: build + 'js/'
    },
    lib: {
        file: {
            debug: "vendors.js",
            minified: "vendors.min.js"
        },
        folder: build + "lib/"
    },
    all: {
        glob: ["server/views/**/*.jade"]
    }
};

/* The jshint task runs jshint with ES6 support. */
gulp.task('jshint', function () {
    return gulp.src(src.scripts.all)
        .pipe(plugins.jshint({
            esnext: true // Enable ES6 support
        }))
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});

/* Compile all script files into one output minified JS file. */
gulp.task('scripts', ['clean:scripts', 'jshint'], function () {

    var sources = browserify({
        entries: src.scripts.app,
        debug: true // Build source maps
    }).on('error', onError)
        .transform(babelify.configure({
            // You can configure babel here!
            // https://babeljs.io/docs/usage/options/
            presets: ["es2015"]
        })).on('error', onError);

    return sources.bundle()
        .on('error', onError)
        .pipe(vinylSourceStream(out.scripts.file))
        .pipe(vinylBuffer())
        .pipe(plugins.sourcemaps.init({
            loadMaps: true // Load the sourcemaps browserify already generated
        }))
        .on('error', onError)
        .pipe(plugins.ngAnnotate())
        .on('error', onError)
        .pipe(gulp.dest(build + "test"))
        .pipe(plugins.uglify({
            compress: {drop_debugger: false}
        }))
        .on('error', onError)
        .pipe(plugins.sourcemaps.write('./', {
            includeContent: true
        }))
        .on('error', onError)
        .pipe(gulp.dest(out.scripts.folder))
        .on('error', onError)

});
gulp.task("lib", ["clean:lib"], function () {
    return gulp.src(src.lib.all)
        .pipe(plugins.sourcemaps.init())
        .on('error', onError)
        .pipe(gulpConcat(out.lib.file.debug))
        .on('error', onError)
        .pipe(gulp.dest(out.lib.folder))
        .pipe(gulpRename(out.lib.file.minified))
        .on('error', onError)
        .pipe(gulpUglify())
        .on('error', onError)
        .pipe(plugins.sourcemaps.write('./'))
        .on('error', onError)
        .pipe(gulp.dest(out.lib.folder));
});

gulp.task("sass", ["clean:sass"], function () {
    return gulp.src(src.sass)
        .pipe(sass({outputStyle: 'compressed'}))
        .on('error', onError)
        .pipe(gulp.dest(out.sass.folder));
});

gulp.task("clean:scripts", function () {
    return gulp.src(out.scripts.folder)
        .pipe(rm());
});

gulp.task("clean:sass", function () {
    return gulp.src(out.sass.folder)
        .pipe(rm());
});

gulp.task("clean:lib", function () {
    return gulp.src(out.lib.folder)
        .pipe(rm());
});

gulp.task("reloader", function () {
    reloader = autoReload();

    return reloader.script()
        .pipe(gulp.dest(build))
});

gulp.task('serve', ['build', 'reloader', 'watch', 'server'], function () {
    gulp.watch(out.all.glob, reloader.onChange);
});

gulp.task("server", function () {
    if (node) {
        node.kill();
    }
    node = spawn('node', ["bin/www"]);
    node.on('close', function (code) {
        if (code === 8) {
            gutil.log("Error detected, waiting for changes...");
        }
    });

    node.stdout.on('data', function (data) {
        console.log('server: ' + data.toString());
    });

    node.stderr.on('data', function (data) {
        console.log('server: ' + data.toString());
    });

});

gulp.task("rebuild:scripts", ["scripts"], function () {
    reloader.onChange.apply(reloader, arguments)
});

gulp.task("rebuild:sass", ["sass"], function () {
    reloader.onChange.apply(reloader, arguments)
});

function rebuildScripts() {
    gulp.run("scripts", bind(reloadClient, this, arguments))
}

function rebuildSass() {
    gulp.run("sass", bind(reloadClient, this, arguments))
}

function restartServer()
{
    gulp.run("server", bind(reloadClient, this, arguments))
}

function reloadClient(){
    reloader.onChange.apply(reloader, arguments)
}

function bind(fn, scope, args)
{
    return function()
    {
        fn.apply(scope, args);
    }
}

function onError(error) {
    gutil.log(gutil.colors.red('Error: ' + JSON.stringify(error.message)));
    this.emit('end');
}
gulp.task('watch', function () {
    gulp.watch(src.scripts.all, rebuildScripts);
    gulp.watch(src.sass, rebuildSass);
    gulp.watch(src.server, restartServer);
});


gulp.task('build', ['lib', 'scripts', 'sass']);
gulp.task('default', ['serve']);