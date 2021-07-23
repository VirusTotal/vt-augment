var gulp = require('gulp');

var closureCompiler = require('google-closure-compiler').gulp();


gulp.task('default', function() {
    return gulp.
        src('./src/**/*.js').
        pipe(closureCompiler({
            compilation_level: 'ADVANCED',
            language_in: 'ECMASCRIPT_2020',
            language_out: 'ECMASCRIPT5',
            warning_level: 'VERBOSE',
            js_output_file: 'dist/vt-augment.min.js',
            entry_point: 'vtaugment',
            module_resolution: 'NODE',
            output_wrapper_file: 'umd-wrapper.js',
            assume_function_wrapper: true,
            hide_warnings_for: 'node_modules/',
            js: [
              'node_modules/google-closure-library/closure/**/*.js',
            ],
        })).
        pipe(gulp.dest('./'));
});
