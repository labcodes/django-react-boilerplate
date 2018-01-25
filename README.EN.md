# Django + React + Webpack

Django is one of the most complete web frameworks available on the market. It manages everything from the database to the final HTML sent to the client. But with the introduction of the concept of [*single page apps*](wikipedia) to the front-end development environment, it has become usual to find systems using Django only to provide an [API](wikipedia) on the back-end that responds JSON data to be consumed by Javascript applications. This architecture that divides front and back-end into two separate code bases enables the independence between these sectors on the development process. It also makes it possible to have multiple client apps interacting with one API, ensuring the consistence of data and business rules and at the same time providing different user interfaces.

Having two code bases though creates some extra work. There's one more environment to configure and another deploy process to care about. A way of making this simpler is to use the resources provided by Django for serving static files. After all, a front-end application is just a set of those files.

The goal of this post is showing step-by-step how to create a basic setup for a [Django project](https://www.djangoproject.com/) including all the necessary resources for a [React app](https://reactjs.org/docs/hello-world.html) managed by [Webpack](https://webpack.js.org/). I'll show how to configure Django to serve both the API and the front-end files.

For those who are more used to the Python enviroment, the nest of Javascript libraries can be a big challenge to grasp. There are many ways of combining the same resources and get similar results. And the references we encounter on the web are frequently obscure on the purpose of each part of the setup. Thats what I'm going to try to show on this post.

## Django and static files

On a project architecture using Django's built in [*template engine*](https://docs.djangoproject.com/en/dev/ref/templates/) the static files used on the templates, like `.css` and images, are stored in a a directory specified on the `STATICFILES_DIRS` settings viriable. You only have to define that variable and Django will serve the files for you.

When we want to use those resources on a template, we can call the `load_static` template tag to generate the URL whith the path to the desired file. On the final HTML the URL will have the path defined by the `STATIC_URL` variable, that is defined as `/static/` on the initial project settings.

A template containing an image for example would be rendered the following way:

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

  - And the final HTML would be renderd as

    ```
    <img src="/static/my_app/example.jpg" alt="My image">
    ```

What we're going to show on the next part of this tutorial is how to configure a Django project to use a specific template tag that inserts on the HTML the paths to scripts and style sheet files created by Webpack. This page will hold the hole Javascript application, developed on a separate folder inside the Django project.

## Configuring the Django project

### [Step 1](https://github.com/labcodes/django-react-webpack/releases/tag/1)

The initial setup we need is just a standard ]Django installation](https://docs.djangoproject.com/en/dev/intro/tutorial01/), optionally with [REST Framework](http://www.django-rest-framework.org/#installation) for the building the API, and the [Django Webpack Loader](https://github.com/ezhome/django-webpack-loader) package.

```
$ pip install django djangorestframework django-webpack-loader
$ pip freeze > requirements.txt
$ django-admin startproject project .
```

Besides the structure already created by Django we are going to create two more directories: `assets` will hold the static files and `templates` will receive the landing page's HTML.

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

Also add the path to the `templates` directory to the `DIRS` key on the `TEMPLATES` variable and the one to `assets` to `STATICFILES_DIRS` so that Django finds the static files there.

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
+assets
  |+dist
  |+src
+node_modules
+project
+templates
.babelrc
-manage.py
-package.json
-requirements.txt
-webpack-stats.json
webpack.config.js
```

Both `dist` and `webpack-stats.json` will be created by Webpack.

## Creating the template for the front-end application

When the users accesses our website she will do it at the root of the domain. The React app will be available at this address. For that purpose we are going to add an entry to our routs list receiving the template with the resources provided by Webpack.

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

    - use it to load the references to the style sheets generated by Webpack insede the `head` tag

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

A view would normally be placed inside the `views.py` of an app, but as this one has no logic and no context object to process, adding it directly to the rout makes it more explicit that there's no Django app associated with it.

For now, if we tried to run the server and open the page on a browser we would see an error message informing that the `webpack-stats.json` file was not found. For that we are going to need the front-end configured.

## Initializing the front-end project

One of the simplest way of setting up a React project is using [create-react-app](https://github.com/facebook/create-react-app). It installs and configures all the necessary libraries the app needs, in fact, with much more than what will be necessary for us. Besides, it hides much of what's happening behind a very simple interface. It is great for quickly starting a project, but it wouldn't help our purpose of showing what each element does for the application.

### [Step 4](https://github.com/labcodes/django-react-webpack/releases/tag/4)

We begin by initializing a project with NPM, the Node Package Manager. It downloads and manages versions of Javascript packages. If you don't have NPM installed, you can take a look at the [documentation](https://nodejs.org/en/) or just search for a simple tutorial for your operating system on the web.

```
$ npm init
```

After running this command some questions about the project will appear on the prompt. If you don't want to answer them for now, just hit enter for all of them. You can edit those information later. In the end a file named `package.json` will be created with the answers you gave. It will hold all the names and versions of the packages managed by NPM, as well as scripts it can execute. A directory called `node_modules` will also have appeared, it contains all the packages downloaded by NPM.

Now create the `src` directory inside `assets` and after that one the `js` folder. Inside it put a file named `index.js` to be the entry point of the application.

```
$ mkdir -p assets/src/js
$ touch assets/src/js/index.js
```

## Configuring Webpack

Webpack is a library used to compile static resources: scripts, images and style sheets, including the SASS and LESS formats for example. It watches and compiles these resources so that they can be delivered directly to the browser based on a configuration file.

Besides Webpack itself, we are going to install the [Webpack Bundle Tracker](https://github.com/ezhome/webpack-bundle-tracker) plugin to register the status of what Webpack is doing.

```
$ npm install --save-dev webpack webpack-bundle-tracker
```

The `--save-dev` parameter of the installation command tells NPM those are development dependencies. It means that that code isn't part of what will be compiled and sent to the client, it will only be used for building it and therefore only needs to be at the machine used for development.

The `package.json` file now should have received the `devDependencies` key, containing the names and versions of those packages.

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

Having Webpack installed we can create it's configuration file. That's where it will gather the information it needs about where and how to compile the files it will manage.

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

    - `webpack-stats.json` as the file where the Bundle Tracker will write the status of the process, the same one we see at the terminal when running Webpack

You can change the names of those files and directories the way you feel prefere, just remember to change it on the Webpack Loader section in `settings.py`.

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

If you look at the directories tree a new one called `dist` should have appeared under `assets` with a file named something like `main-315df4b2f5abf7716c38.js`. There should also be a new file called `webpack-stats.json` on the projec root.

With the Dajngo server and Webpack running you can open the browser to see that the application is up.

![Django server and watch running](images/img1.png)

    **Tip**: If the process finishes and exist by itself when running `npm run watch` it could be becouse of [this](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers). You should also add `dist` and `webpack-stats.json` to your `.gitignore` file if you're using GIT.

## Configuring React

Until now, the setup we have could be used for any Javascript framework you want to use for an application. From this point we are going to add the settings needed by React.

```
$ npm install --save react react-dom
```

Notice that when installing these packages we used the parameter `--save` instead of `--save-dev` like we did with the ones before. That's because, unlike Webpack, the React code will be compiled and delivered to the client on the final result.

One thing about React that makes it different from other frameworks like Angular or JQuery is the concept of virtual DOM. Instead of manipulating elements that already exist on the DOM, it injects all the HTML that the user sees on the root element of the app. That's why the template we created for the Django view to render only had one `div`. For that reason we won't create distinct `.html` and `.js` files - the React components are in fact Javascript files containing the HTML they will render. There's a special syntax for doing that called [JSX](https://reactjs.org/docs/introducing-jsx.html) that needs to be transpiled.

Uma característica do React que difere ele de outros *frameworks* como Angular ou JQuery é o *virtual DOM*: ao invés de manipular os elementos já existentes no DOM, ele se encarrega de injetar todo o HTML que aparece para o usuário no elemento raíz da aplicação. É por isto que o template que criamos no Django possui apenas uma `div`, que receberá todo o conteúdo manipulado pelo React. Assim, ao invés de criar arquivos separados de `.html` e `.js`, os componentes do React são na verdade arquivos Javascript que já contêm o HTML que vão renderizar. Para isso, usa-se uma sintaxe especial chamada [JSX](https://reactjs.org/docs/introducing-jsx.html) que depois precisar ser transpilada para virar strings que podem ser lidas pelo interpretador do browser. Quem faz este trabalho de transpilar as sintexes especiais que vamos usar é o [Babel](https://babeljs.io/).

Além do JSX, vamos adicionar as regras para utilizar a sintaxe do [ES6](https://codetower.github.io/es6-features/), os recursos mais novos do Javascript que ainda não estão implementados nos browsers. Dessa forma, podemos escrever com a sintaxe nova sem nos preocupar com compatibilidade.

Vamos instalar as bibliotecas do Babel nas dependências de desenvolvimento e criar um arquivo de configuração para ele.

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

Agora podemos informar no `webpack.config.js` as regras que o Webpack deve utilizar quando for compilar os arquivos `.js` ou `.jsx`. Vamos definir que todo arquivo do projeto com estas extensões devem passar pelo *loader* do Babel, exceto os que estão no diretório `node_modules`.

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

Se estiver com o `npm run watch` rodando não se esqueça de interromper o processo e rodá-lo novamente toda vez que editar o `webpack.config.js`.

Com o que temos até aqui, podemos criar o primeiro componente React.

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

Usamos o ReactDOM para procurar no HTML um elemento com o id `react-app` e renderizar dentro dele o HTML gerado pelo componente `App`.

### Organizando a aplicação

Há diversas possibilidades de organizar a arquitetura de um projeto React. Nós escolhemos aqui a estrutura que separa *components* e *containers*. Os primeiros são os blocos que serão usados para montar as páginas e podem ser reaproveitados em lugares diversos, já os outros representam as páginas em si, contendo o estado global do conteúdo visualizado pelo usuário.

### [Passo 6](https://github.com/labcodes/django-react-webpack/releases/tag/6)

```
$ mkdir -p assets/src/js/components/Title assets/src/js/containers/App
$ touch assets/src/js/components/Title/index.js assets/src/js/containers/App/index.js
```

Vamos extrair o componente que criamos diretamente na raíz da aplicação e dividi-lo em um *container* e um componente genérico que pode ser aproveitado em outras páginas.

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

`Title` agora é apenas um elemento de título que recebe um texto para usar de conteúdo. Quem define o texto específico é o componente que vai usá-lo.

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

No ponto de entrada não há mais nenhum componente sendo definido, ele apensas importa `App` do diretório de *containers*.

`assets/src/js/index.js`
```js
import React from 'react';
import ReactDOM from 'react-dom';

import App from './containers/App';

ReactDOM.render(<App />, document.getElementById('react-app'));
```

A partir deste momento, não será mais preciso alterar a raíz da aplicação, ela apensas fará o papel de inserir o container principal na `div` correta da página. Todos os outros componentes e *containers* serão criados em seus respectivos diretórios e importados por quem for usá-los.

## Adicionando estilos

Para desenvolver uma aplicação por completo não basta adicionar somente o conteúdo, é preciso adicionar também os estilos. Para compilar os arquivos de CSS, vamos precisar de mais alguns *loaders* e do *plugin* [Estract Text](https://github.com/webpack-contrib/extract-text-webpack-plugin). Neste projeto, escolhemos usar o SASS como processador de estilos, mas se preferir usar LESS, você pode seguir os exemplos da [documentação](https://github.com/webpack-contrib/css-loader).


### [Passo 7](https://github.com/labcodes/django-react-webpack/releases/tag/7)

```
$ npm install --save-dev css-loader style-loader sass-loader node-sass extract-text-webpack-plugin
```

Depois de instalar as dependência, vamos adicionar novas regras para o Webpack compilar os estilos.

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

Definimos aqui o mesmo padrão de nomenclatura para os arquivos de `.css` que usamos para os `.js`. Assim, a *tag* que adicionamos no template do Django `{% render_bundle 'main' 'css' %}` vai procurar pelos arquivos que começam com o nome `main` e têm a extensão `.css`.

Agora podemos adicionar nosso primeiro aquivo de estilo e usá-lo no Javascript.

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

Lembrando que na sintaxe do JSX não se usa `class`, que é uma palavra reservada, e sim `className` para indicar as classes de CSS.

Pronto! Com este *setup* temos um esqueto de projeto pronto para ser desenvolvido.

É provável que além dessas bibliotecas, você queira adicionar outras ferramentas como o Redux, para gerenciar os estados dos componentes do React, o Bootstrap, para estilos customizados, ou compiladores, para minificar os *scripts*, por exemplo. O procedimento para isso será o mesmo que usamos para instalar o React e os *loaders* e *plugins* do Webpack: todas as bibliotecas importadas e utilizadas dentro do seu código são adicionadas às dependências normais com o `--save`, já as ferramentas de compilação e transformação do seu código vão para as dependências de desenvolvimento com o `--save-dev` e suas regras de utilização ficam nas configurações do Webpack. Na documentação de todas elas você vai encontrar exemplos de como configurá-las.
