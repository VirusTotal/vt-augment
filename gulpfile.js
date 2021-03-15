var gulp = require('gulp');

var closureCompiler = require('google-closure-compiler').gulp();

gulp.task('default', function() {
    return gulp.
        src('./src/**/*.js').
        pipe(closureCompiler({
            compilation_level: 'SIMPLE',
            language_in: 'ECMASCRIPT_2015',
            language_out: 'ECMASCRIPT5',
            warning_level: 'VERBOSE',
            js_output_file: 'dist/vt-augment.min.js',
            process_common_js_modules: true,
            entry_point: 'vt-augment',
            module_resolution: 'NODE',
            externs: 'externs.js',
            output_wrapper_file: 'umd-wrapper.js',
            dependency_mode: 'PRUNE',
            assume_function_wrapper: true,
            js: [
              'node_modules/google-closure-library/closure/**/*.js',
              'node_modules/lscache/lscache.js',
            ],
        })).
        pipe(gulp.dest('./'));
});
