let gulp = require('gulp');
let uglify = require('gulp-uglify');
//let rename = require('gulp-rename');
let concat = require('gulp-concat');
let babel = require('gulp-babel');
let order = require('gulp-order');


//continuar con watch:
//https://www.youtube.com/watch?v=jgcfEhiCkG4&list=PLv1YUP7gO_viROuRcGsDCNM-FUVgMYb_G&index=3
//minuto 14
//https://www.youtube.com/watch?v=gBER4Or86hE   react... redux

//www.youtube.com/watch?v=bopDGwJFTv4/https://www.youtube.com/watch?v=sZ0z7B7QmjI&index=2&list=PLillGF-RfqbZ7s3t6ZInY3NjEOOX7hsBv ES6

// https://www.youtube.com/watch?v=bopDGwJFTv4 babel minuto 15

gulp.task('ownjs', function () {


	gulp.src(['ui/js/**/*.js', '!ui/js/vendors'])
	.pipe(babel({
		presets: ['es2015','react']
	}))
	.pipe(concat('main.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('public/scripts'));
});

gulp.task('vendorsjs', function () {
	gulp.src('ui/js/vendors/**/*.js')
	.pipe(order([
		'tooltip.js', 'popover.js'
	]))
	.pipe(concat('vendors.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('public/scripts'));
});

gulp.task('watch', function () {
	gulp.watch('ui/js/**/*.js', ['ownjs', 'vendorsjs'])
});


gulp.task('default', ['ownjs', 'vendorsjs', 'watch']);
