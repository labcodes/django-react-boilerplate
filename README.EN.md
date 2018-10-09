# Django + React + Webpack

Django is one of the most resourceful web frameworks available on the market. It manages everything from the database to the final HTML sent to the client. But with the introduction of the concept of [*single page apps*](https://en.wikipedia.org/wiki/Single-page_application) to the front-end development environment, it has become usual to find systems using Django only to provide an [API](https://en.wikipedia.org/wiki/Web_API) on the back-end that responds JSON data to be consumed by Javascript applications. This architecture that divides front and back-end into two separate code bases enables the independence between these sectors on the development process. It also makes it possible to have multiple client apps interacting with one API, ensuring the consistency of data and business rules providing different user interfaces at the same time..

Having two code bases though creates some extra work. There's one more environment to configure and another deploy process to care about. A way of making this simpler is to use the resources provided by Django for serving static files. After all, a front-end application is just a set of those files.

The goal of this post is showing step-by-step how to create a basic setup for a [Django project](https://www.djangoproject.com/) including all the necessary resources for a [React app](https://reactjs.org/docs/hello-world.html) managed by [Webpack](https://webpack.js.org/). I'll show how to configure Django to serve both the API and the front-end files.

For those who are more used to the Python  environment, the nest of Javascript libraries can be a big challenge to grasp. There are many ways of combining the same resources and get similar results. And the references we encounter on the web are frequently obscure on the purpose of each setup part. That's what I'm going to try to show here.

The first part of this post is intended to show how to do the necessary setup for Django to provide the front-end application through its resources for serving static files. After that, we're going to build the basic structure of a React application focusing on showing the roles of each element in it. You won't find here a detailed explanation of how React works, only some core concepts to understand the configuration. The purpose of this post is to empower someone with more background on the back-end to be able to integrate with the front-end more easily without getting lost in the development environment setup. From that point, you can search for other more specific tutorials to the framework itself or even read the documentation, which is very detailed and understandable.

## Django and static files

On a project architecture using Django's built-in [*template engine*](https://docs.djangoproject.com/en/dev/ref/templates/) the static files used on the templates, like `.css` and images can be stored inside each app's `static` directory or in the directory specified on the `STATICFILES_DIRS` settings variable. You only have to define that variable and Django will serve the files for you.

When we want to use those resources on a template, we can call the `load_static` template tag to generate the URL with the path to the desired file. On the final HTML, the URL will have the path defined by the `STATIC_URL` variable - defined as `/static/` in the initial project settings.

A template containing an image, for example, would be rendered the following way:

  - Having the image located at `assets/my_app/examples.jpg`

  - The `settings.py` file should have the configuration

    ```
    STATIC_URL = '/static/'

    STATICFILES_DIRS = (
        os.path.join(BASE_DIR, 'assets'),
    )
    ```

  - The `static` template tag should be loaded and used to build the images URL

    ```
    {% load static %}
    <img src="{% static "my_app/example.jpg" %}" alt="My image"/>
    ```

  - And the final HTML would be rendered as

    ```
    <img src="/static/my_app/example.jpg" alt="My image">
    ```

What we're going to show on the next part of this tutorial is how to configure a Django project to use a specific template tag that inserts on the HTML the paths to scripts and style sheet files created by Webpack. This page will hold the whole Javascript application, developed on a separate folder inside the Django project.

## Configuring the Django project

### [Step 1](https://github.com/labcodes/django-react-webpack/releases/tag/1)

The initial setup we need is just a standard [Django installation](https://docs.djangoproject.com/en/dev/intro/tutorial01/), optionally with [REST Framework](http://www.django-rest-framework.org/#installation) for the building the API, and the [Django Webpack Loader](https://github.com/ezhome/django-webpack-loader) package.

```
$ pip install django djangorestframework django-webpack-loader
$ pip freeze > requirements.txt
$ django-admin startproject project .
```

Besides the structure already created by Django, we are going to create two more directories: `assets` will hold the static files and `templates` will receive the landing page's HTML.

```
$ mkdir assets templates
```

### [Step 2](https://github.com/labcodes/django-react-webpack/releases/tag/2)

In `settings.py` add REST Framework - if you want to use it for building the API - and Django Webpack Loader to the `INSTALLED_APPS` variable.

`project/settings.py`
```python
INSTALLED_APPS = [
  ...
  'rest_framework',
  'webpack_loader',
  ...
]
```

Also, add the path to the `templates` directory to the `DIRS` key on the `TEMPLATES` variable and the one to `assets` to `STATICFILES_DIRS` so that Django finds the static files there.

`project/settings.py`
```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'assets'),
)
```

The last configuration we need is for the Webpack Loader package. It's going to need two pieces of information:

- where, inside the static files directory, will be the Webpack generated files (we chose the name `dist` for it)

- in which file should it look for the status of the Webpack process

`project/settings.py`
```python
WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'dist/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
    }
}
```

When we have finished the front-end setup, the project will have the following structure:


```
├── node_modules
├── project
├── package.json
├── templates
├── babelrc
├── manage.py
├── package.json
├── requirements.txt
├── webpack-stats.json
├── webpack.config.js
└── assets
    └── dist
    └── src
```

Both `dist` and `webpack-stats.json` will be created by Webpack.

## Creating the template for the front-end application

When the users access our website she will do it at the root of the domain. The React app will be available at this address. For that purpose, we are going to add an entry to our routs list receiving the template with the resources provided by Webpack.

### [Step 3](https://github.com/labcodes/django-react-webpack/releases/tag/3)

First, create the HTML file for the template.

```
$ mkdir templates/frontend
$ touch templates/frontend/index.html
```

`templates/frontend/index.html`
```html
{% load render_bundle from webpack_loader %}
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Django React Webpack</title>
    <!-- Webpack rendered CSS -->
    {% render_bundle 'main' 'css' %}
</head>

<body>
    <div id="react-app"></div>
    <!-- Webpack rendered JS -->
    {% render_bundle 'main' 'js' %}
</body>
</html>
```

What we have done here is:

- load the `render_bundle` template tag from `webpack_loader`

- use it to load the references to the style sheets generated by Webpack inside the `head` tag

- load the references to the scripts files also generated by Webpack at the end of the `body` tag

- create a `div` to hold the React app

After we have finished the rest of the setup, the rendered HTML will look like this:

```html
<!DOCTYPE html>
<html>
  <head>
      <meta charset="UTF-8">
      <title>Django React Webpack</title>
      <!-- Webpack rendered CSS -->
      <link type="text/css" href="/static/dist/main-ce37ab46c0988b0f0827.css" rel="stylesheet">
  </head>

  <body>
      <div id="react-app"><div></div>
      <!-- Webpack rendered JS -->
      <script type="text/javascript" src="/static/dist/main-ce37ab46c0988b0f0827.js"></script>
  </body>
</html>
```

To make this page available, create a `TemplateView` directly in the URLs file.

`project/urls.py`
```python
from django.contrib import admin
from django.views.generic import TemplateView
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='frontend/index.html')),
]
```

A view would normally be placed inside the `views.py` of an app, but since this one has no logic and no context object to process, adding it directly to the route makes it more explicit that there's no Django app associated with it.

At the moment, if we tried to run the server and open the page in a browser we would see an error message informing that the `webpack-stats.json` file was not found. For that, we need the front-end to be configured.

## Initializing the front-end project

One of the simplest ways of setting up a React project is using [create-react-app](https://github.com/facebook/create-react-app). It installs and configures all the necessary libraries the app needs, in fact, with much more than what will be necessary for us. Besides, it hides a lot of what's happening behind a very simple interface. It is great for quickly starting a project, but it wouldn't help our purpose of showing what each element does for the application.

### [Step 4](https://github.com/labcodes/django-react-webpack/releases/tag/4)

We begin by initializing a project with NPM, the Node Package Manager. It downloads and manages versions of Javascript packages. If you don't have NPM installed, you can take a look at the [documentation](https://nodejs.org/en/) or just search for a simple tutorial for your operating system on the web.

```
$ npm init
```

After running this command, some questions about the project will appear on the prompt. If you don't want to answer them for now, just hit enter for all of them. You can edit that information later. In the end, a file named `package.json` will be created with the answers you gave. It will hold all the names and versions of the packages managed by NPM, as well as scripts it can execute. A directory called `node_modules` will also have appeared, containing all the packages downloaded by NPM.

Now create the `assets/src/js/index.js` file. It will be the entry point of the application.

```
$ mkdir -p assets/src/js
$ touch assets/src/js/index.js
```

## Configuring Webpack

Webpack is a library used to compile static resources: scripts, images and style sheets, including the SASS and LESS formats for example. It monitors and compiles these resources so that they can be delivered directly to the browser based on a configuration file.

Besides Webpack itself, we are going to install the [Webpack Bundle Tracker](https://github.com/ezhome/webpack-bundle-tracker) plugin to register the status of what Webpack is doing.

```
$ npm install --save-dev webpack webpack-bundle-tracker
```

The `--save-dev` parameter of the installation command tells NPM those are development dependencies. It means that the code isn't part of what will be compiled and sent to the client, it will only be used for building it and therefore only needs to be at the machine used for development.

The `package.json` file should have received by now the `devDependencies` key, containing the names and versions of those packages.

`package.json`
```json
...
"devDependencies": {
  "webpack": "^3.10.0",
  "webpack-bundle-tracker": "^0.2.1"
}
...
```

**Tip**: If you are using GIT for version control add the `node_modules` directory and the `package-lock.json` file to `.gitignore`. Also, if you didn't change the database settings for the Django project and intend to use the SQLite backend, add the `db.sqlite3` file to it too;

### [Step 5](https://github.com/labcodes/django-react-webpack/releases/tag/5)

Having Webpack installed we can create its configuration file. That's where it will gather the information it needs about where and how to compile the files it will manage.

```
$ touch webpack.config.js
```

`webpack.config.js`
```js
var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');


module.exports = {
  entry:  path.join(__dirname, 'assets/src/js/index'),

  output: {
    path: path.join(__dirname, 'assets/dist'),
    filename: '[name]-[hash].js'
  },

  plugins: [
    new BundleTracker({
      path: __dirname,
      filename: 'webpack-stats.json'
    }),
  ],

}
```

What we defined here is:

- the `assets/src/js/index.js` file as the entry point of the app

- a pattern for the compiled `.js` files consisting of a name, 'main' by default, and a hash

- `webpack-stats.json` as the file where the Bundle Tracker will write the status of the process (the output we see at the terminal when running Webpack)

You can change the names of those files and directories the way you prefer, just remember to change it on the Webpack Loader section in `settings.py`.

As we start compiling the files, if there's an error message in `webpack-stats.json` and the Django server is running with the `DEBUG` parameter set to `True` this message will be displayed as a 500 error the same way Django's own messages are shown.

Back to the `package.json` file, we can add two entries to the `scripts` attribute for automating the task of running Webpack:

`package.json`
```json
...
"scripts": {
  ...
  "start": "./node_modules/.bin/webpack --config webpack.config.js",
  "watch": "npm run start -- --watch"
},
...
```

Now for calling Webpack to compile the files you can run `npm run start` on a terminal. For doing it on watch mode type `npm run watch`: it will update the results every time a file is changed.

If you look at the directories tree a new one called `dist` should have appeared under `assets` with a file named something like `main-315df4b2f5abf7716c38.js`. There should also be a new file called `webpack-stats.json` on the project root.

With the Django server and Webpack running you can open the browser to see that the application is up.


**Tip**: If the process finishes and exits by itself when running `npm run watch` it could be because of [this](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers). You should also add `dist` and `webpack-stats.json` to your `.gitignore` file if you're using GIT.

## Configuring React

Until now, the setup we have could be used for any Javascript framework you want to use for an application. From this point, we are going to add the settings needed by React.

```
$ npm install --save react react-dom
```

Notice that when installing these packages we used the parameter `--save` instead of `--save-dev` like we did with the ones before. That's because, unlike Webpack, the React code will be compiled and delivered to the client on the final result.

One thing about React that makes it different from other frameworks like Angular or JQuery is the concept of virtual DOM. Instead of manipulating elements that already exist in the DOM, it injects all the HTML seen by the user in the root element of the app. That's why the template we created only had one `div`. For that reason, we won't create distinct `.html` and `.js` files - the React components are in fact Javascript files containing the HTML they will render. There's a special syntax for that called [JSX](https://reactjs.org/docs/introducing-jsx.html). It needs to be transpiled to become strings that can be then interpreted by the browser. That job is done by the [Babel](https://babeljs.io/) library.

Besides JSX, we're going to need other transpiling rules to be able to use the [ES6](https://codetower.github.io/es6-features/) syntax, the new Javascript features not yet implemented by the browsers. It makes it possible to write modern Javascript without worrying about browser compatibility.

Add Babel, it's loaders and presets to the development dependencies and create a configuration file for it.

```
$ npm install --save-dev babel-cli babel-core babel-loader babel-preset-env babel-preset-es2015 babel-preset-react babel-register
$ touch .babelrc
```

`.babelrc`
```json
{
    "presets": [
      "es2015", "react"
    ]
}
```

Now we can tell Webpack which rules to follow when compiling the `.js` or `.jsx` files. We establish that all those files in the project having those extensions should be handled by Babel Loader. Except for the ones inside `node_modules` where the project's dependencies live.

`webpack.config.js`
```js
module.exports = {
    ...
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
}
```

If you have `npm run watch` running you'll have to stop it and run again. Do it every time you alter the `webpack.config.js` file.

With that configuration we're able to create our first React component.

`assets/src/js/index.js`
```js
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render () {
    return (
      <h1>Django + React + Webpack + Babel = Awesome App</h1>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-app'));
```

We use `ReactDOM` to find an element with the `react-app` id and render inside it the HTML generated by the `App` component.

### Organizing the application

### [Step 6](https://github.com/labcodes/django-react-webpack/releases/tag/6)

There are many ways to structure the architecture of a React project. We are going to use here the one that separates its elements in components and containers. The first ones are the building blocks used to assemble the pages, they can be reused in several contexts. The other ones represent the pages themselves, containing the state of the content displayed for the user.

```
$ mkdir -p assets/src/js/components/Title assets/src/js/containers/App
$ touch assets/src/js/components/Title/index.js assets/src/js/containers/App/index.js
```

Extract the component created directly in the application root and divide it in a container and a generic component to be used in other pages.

`assets/src/js/components/Title/index.js`
```js
import React from 'react';

const Title = ({ text }) => {
  return (
    <h1>{text}</h1>
  )
}
export default Title;

```

`Title` is now just an element that receives a text to be set as its content. The content will be defined by the component containing `Title`.

`assets/src/js/containers/App/index.js`
```js
import React from 'react';

import Title from '../../components/Title';


class App extends React.Component {
  render () {
    const text = 'Django + React + Webpack + Babel = Awesome App';
    return (
      <Title text={text} />
    )
  }
}

export default App;
```

In the entry point, there's no component being defined, it only imports `App` from the containers package.

`assets/src/js/index.js`
```js
import React from 'react';
import ReactDOM from 'react-dom';

import App from './containers/App';

ReactDOM.render(<App />, document.getElementById('react-app'));
```

## Adding styles

To have a complete application only content won't be enough, we need to add styles to it too. For compiling CSS files some other loaders and the [Estract Text](https://github.com/webpack-contrib/extract-text-webpack-plugin) plugin will be necessary. For this example, we decided to use SASS as a styles pre-processor, but if you prefer using LESS, just follow the instructions in the [documentation](https://github.com/webpack-contrib/css-loader).

### [Step 7](https://github.com/labcodes/django-react-webpack/releases/tag/7)

```
$ npm install --save-dev css-loader style-loader sass-loader node-sass extract-text-webpack-plugin
```

After installing the dependencies, add some new rules for Webpack to compile the style sheets.

`webpack.config.js`
```js
...
var ExtractText = require('extract-text-webpack-plugin');

module.exports = {
    ...
    plugins: [
      ...
      new ExtractText({
        filename: '[name]-[hash].css'
      }),
    ],

    module: {
      rules: [
        ...
        {
          test: /\.css$/,
          loader: ['style-loader', 'css-loader'],
        },
        {
          test: /\.scss$/,
          use: ExtractText.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader']
          })
        },
      ],
    },
}
```

The naming pattern defined here for the `.css` files is the same used for the `.js` ones. The `{% render_bundle 'main' 'css' %}` tag in the Django template will search for CSS files beginning with `main` and followed by a hash.

Now we can create our first style sheet and import it into the components.

```
$ mkdir assets/src/scss
$ touch assets/src/scss/index.scss assets/src/scss/title.scss
```

`assets/src/scss/index.scss`
```css
@import "./title";
```

`assets/src/scss/title.scss`
```css
.title {
  color: red;
}
```

`assets/src/js/index.js`
```js
...
import '../scss/index.scss';
...
```

`assets/src/js/components/Title/index.js`
```js
...
    <h1 className="title">{text}</h1>
...
```

Remember that the JSX syntax doesn't allow the `class` attribute. Use `className` instead.

That's it! Whit this setup we have a project ready to be developed.

You're probably going to add more libraries like Redux - for managing React's components states -, Bootstrap - for custom styles - or other compilers to minify or uglify your scripts. The procedure to do that is the same we did to install React, the loaders and plugins: all libraries imported and used in your code should be added to the dependencies with `--save`, the ones to compiling or transpiling your code go to the dev dependencies with `--save-dev` and its rules are to be set in Webpack's configuration file. You'll find the detailed instructions in their documentation.
