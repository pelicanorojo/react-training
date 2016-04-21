# React training

## Building a react SPA by little steps, enhancing the project in the process.

I've beginning this project with the main goal of use react for a personal need.

I am runner, and web developer, so I wanted to try something similar to my favourite web training application (adidas's micoach).

For this I have captured the micoach api json response and save this in a json file (data.json) (by now).
And use as a project base, a facebook react totorial, and a lot of posts.
I consider this as ones of the last knowledge source that help me a lot:
https://vimeo.com/151603293
https://css-tricks.com/learning-react-router/
But it is know for all of us, that the facebook's learning material is amazing (its react github pages, redux, its videos on youtube.).

So I will be going throw different steps in my project ( I hope this), keep each big step in a branch,
and the last one merged onto master:

## How to use:
1 Clone this repo.
2 Run npm install where you cloned ths repo.
3 Start with:
```
node server.js
```
4 In your browser type this url:
````
http://localhost:3000
````
5 In Master will be the last state. And in special branchs, like for example usingFlux,
some important steps.


## Steps
1 Startup
  * Read a lot of react posts, trying to keep sane. (almost done)
  * Copy a project and adapt it for my running training app. done
  * The app and it api is served with express. done
  * The app show a list of chronologically sorted trainings. done
  * The app highlights the nearest next training. done
  * The app center the training lists in the nearest next training. bug
  * the app have hardcoded the race day. done

2  Apply Presentational/Container component division.
  * Apply Presentational/Container component division.
  * The app center the training lists in the nearest next training. fix
  * Apply some ES6 syntax (destructuring, literal objects enhancing, template strings, let....)

3 Apply Flux Architecture. ( Some ideas were picked from this sample: https://github.com/facebook/flux/tree/master/examples/flux-chat )
  * Create stores (one by now).
  * Create actions creator.
  * Create the Application Actions Dispatcher.  
  * Listen to store change events ( in container views ).
  * Trigger workouts load on startup.
  * Create a restapi utility.
  * Preserve prior behaviors (scroll left panel on select).

##backlog
* Try to use a single-feature focused ajax library like Axios.
* Migrate to Redux.
* Add urls with react-router.
* Add more trainings ( 10Km race for 2 3 months, 21k and more 42k trainings)
* Add a training importer.
* Add a training switch.
* Let edit the race day (datepicker)
* Support serverside prerendering.
* Customize Babel.
* Add a module system (Webpack or Browserify).
* Add Mocha and Chai, or the tool needed for react app testing.
* Add trainer notes.
* Add Gulp.
* Host in some PaaS.

## License

(The MIT License)

Copyright (c) 2016 Pablo Benito &lt;bioingbenito@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
