var gulp = require('gulp');

var closureCompiler = require('google-closure-compiler').gulp();

gulp.task('default', function() {
    return gulp.
        src('./src/**/*.js').
        pipe(closureCompiler({
            compilation_level: 'ADVANCED',
            warning_level: 'VERBOSE',
            js_output_file: 'dist/vt-augment.min.js',
            process_common_js_modules: true,
            entry_point: 'vt-augment',
            module_resolution: 'NODE',
            js: 'node_modules/lscache/lscache.js',
            externs: 'externs.js',
            warnings_allowlist_file: 'zzz',
        })).
        pipe(gulp.dest('./'));
});
