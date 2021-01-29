var gulp = require('gulp');

var closureCompiler = require('google-closure-compiler').gulp();

gulp.task('default', function() {
    return gulp.
        src('./src/**/*.js').
        pipe(closureCompiler({
            warning_level: 'VERBOSE',
            js_output_file: 'build/vt-augment.min.js',
            dependency_mode: 'PRUNE',
            js_module_root: '/src',
            process_common_js_modules: true,
            entry_point: 'vt-augment'
        })).
        pipe(gulp.dest('./'));
});
