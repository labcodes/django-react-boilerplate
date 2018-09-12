# Django + React + Webpack

O Django é um dos *frameworks* de desenvolvimento *web* mais completos disponíveis, com quase tudo o que você precisa para colocar uma aplicação no ar. Ele gerencia tudo, desde o banco de dados até o HTML final enviado ao cliente. Porém, com o advento das [*single page apps*](https://pt.wikipedia.org/wiki/Aplicativo_de_p%C3%A1gina_%C3%BAnica), é cada vez mais comum criar aplicações que utilizam o Django somente para fornecer uma [*API*](https://pt.wikipedia.org/wiki/Interface_de_programa%C3%A7%C3%A3o_de_aplica%C3%A7%C3%B5es) que responde dados em formato JSON, consumidos por aplicações desenvolvidas nos mais variados frameworks Javascript. Esta arquitetura que separa o *front* do *back-end* permite um desacoplamento das duas áreas, com times que podem desenvolver em seus domínios de forma totalmente independente. Além de possibilitar que diversos *apps* clientes interajam com uma mesma API, garantindo ao mesmo tempo integridade de dados e regras de negócio e uma diversidade de interfaces de usuário.

Dois projetos diferentes porém geram um trabalho a mais: são dois *deploys* separados, dois ambientes para configurar. Uma forma de simplificar este cenário é usar os recursos que o próprio Django já nos oferece para servir arquivos estáticos. Afinal, a aplicação *front-end* nada mais é do que um conjunto de arquivos deste tipo.

O objetivo deste post é mostrar passo-a-passo como criar um *setup* básico para um projeto [Django](https://www.djangoproject.com/) incluindo toda a estrutura para montar uma *app* em [React](https://reactjs.org/docs/hello-world.html) gerenciada pelo [Webpack](https://webpack.js.org/). Vou mostrar como configurar o Django para fazer este papel de servir tanto a *API* quanto a aplicação do *front*.

Para quem tem mais experiência com o ambiente do Python, entender o emaranhado das bibliotecas do *front-end* pode ser um grande desafio. Há várias formas possíveis de combinar os mesmos recursos para chegar num resultado parecido e as referências que encontramos por aí não costumam ser muito claras sobre o por quê de cada coisa.

Na primeira parte desse post eu pretendo mostrar como fazer o *setup* necessário no Django para disponibilizar a aplicação do *front* através da estrutura que ele já tem para servir arquivos estáticos. Além disso, vamos montar um esqueleto básico de uma aplicação em React, focando no propósito de cada elemento dele. Você não vai encontrar aqui uma explicação detalhada de como funciona o React, apenas alguns conceitos sobre o *framework* necessários para entender a configuração do ambiente. A intenção desse post é possibilitar que alguém que tenha mais experiência no *back-end* consiga integrar o *front* com mais facilidade, sem se perder na teia das bibliotecas que compõem o ambiente de desenvolvimento. A partir daí, você pode procurar por outros tutoriais ou buscar mais informações na própria documentação da ferramenta que é bastante completa e bem compreensível.

## Django e arquivos estáticos

Numa arquitetura de projeto usando apenas o Django, com a [*template engine*](https://docs.djangoproject.com/en/dev/ref/templates/) do próprio *framework*, os estáticos, como arquivos `.css` e imagens, são armazenados em diretórios especificados na variável de configuração `STATICFILES_DIRS`. Basta definir este parâmetro e o Django se encarrega de servir os arquivos.

Quando precisamos usar estes recursos nos templates, chamamos a *template tag* `load_static` que gera a URL correta com o caminho para o arquivo. No HTML final, a URL aparece com o caminho definido pelo parâmetro `STATIC_URL`, que por padrão vem setado como `/static/`.

Um *template* que contenha uma imagem, por exemplo, seria renderizado da seguinte forma:

  - Com a imagem localizada em `assets/my_app/examples.jpg`

  - O `settings.py` deve ter as configurações de estáticos

    ```
    STATIC_URL = '/static/'

    STATICFILES_DIRS = (
        os.path.join(BASE_DIR, 'assets'),
    )
    ```

  - A *template tag* `static` deve ser carregada e utilizada para montar a URL da imagem

    ```
    {% load static %}
    <img src="{% static "my_app/example.jpg" %}" alt="My image"/>
    ```

  - E o HTML final será renderizado como

    ```
    <img src="/static/my_app/example.jpg" alt="My image">
    ```

O que vamos fazer neste passo-a-passo nada mais é do que configurar um projeto Django para usar uma *template tag* específica para carregar arquivos gerados pelo Webpack, que vai inserir os *links* para os recursos de *scripts* e estilos em um *template*. Esta página renderizada a partir do *template* vai conter toda a aplicação Javascript desenvolvida em um diretório separado dentro do projeto Django.  

## Configurando o projeto

### [Passo 1](https://github.com/labcodes/django-react-webpack/releases/tag/1)

O *setup* necessário é somente uma [instalação padrão do Django](https://docs.djangoproject.com/en/dev/intro/tutorial01/), opcionalmente com o [REST Framework](http://www.django-rest-framework.org/#installation) para a criação da *API* que servirá os recursos do *back-end*, e o pacote [Django Webpack Loader](https://github.com/ezhome/django-webpack-loader).

```
$ pip install django djangorestframework django-webpack-loader
$ pip freeze > requirements.txt
$ django-admin startproject project .
```

Vamos criar dois novos diretórios além dos criados pelo Django: `assets` para armazenar todos os nossos recursos do *front-end* e `templates` para conter a página inicial da aplicação.

```
$ mkdir assets templates
```

### [Passo 2](https://github.com/labcodes/django-react-webpack/releases/tag/2)

No `settings.py`, o arquivo de configurações do projeto, vamos adicionar o REST Framework, caso queira usá-lo para construir a *API*, e o Webpack Loader às `INSTALLED_APPS`.

`project/settings.py`
```python
INSTALLED_APPS = [
  ...
  'rest_framework',
  'webpack_loader',
  ...
]
```

Adicionamos também o diretório de `templates` à variável de `TEMPLATES` para que o Django encontre nossos arquivos HTML e o diretório `assets` ao `STATICFILES_DIRS` para que os estáticos sejam servidos.

`project/settings.py`
```python
TEMPLATES = [
    {
        'back-end': 'django.template.back-ends.django.DjangoTemplates',
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

A última configuração necessária é a do Webpack Loader. Ele vai precisar de duas informações:

  - onde, dentro do diretório de estáticos, estarão os arquivos gerados pelo Webpack, no caso escolhemos `dist`

  - em qual arquivo ele deve buscar o *status* do que está sendo processado pelo Webpack

`project/settings.py`
```python
WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'dist/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
    }
}
```

Quanto tivermos terminado as configurações do *front-end*, o projeto terá a seguinte estrutura:

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

Tanto `dist` quanto `webpack-stats.json` serão gerados pelo Webpack.

## Criando o template para a aplicação do *front*

Nosso usuário, quando acessar o endereço do site, vai fazer isso na raíz do domínio e é nesse ponto que vamos disponibilizar a aplicação React. Para isso, vamos adicionar uma entrada à lista de rotas da aplicação com o *template* que vai receber os arquivos disponibilizados pelo Webpack.

### [Passo 3](https://github.com/labcodes/django-react-webpack/releases/tag/3)

Primeiramente, vamos criar o arquivo HTML do *template*:

```
$ mkdir templates/front-end
$ touch templates/front-end/index.html
```

`templates/front-end/index.html`
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

O que temos neste arquivo é:

  - Carregamos a *template tag* `render_bundle` do `webpack_loader`

  - No `head` da página, usamos o `render_bundle` para carregar os estilos gerados pelo Webpack

  - No final do `body`, usamos o `render_bundle` para carregar os *scripts* também gerados pelo Webpack

  - O `body` recebe uma `div` que será a raíz da aplicação React

Depois de terminado o restante da configuração ao final do passo 5 deste post, o HTML renderizado terá um conteúdo parecido com isto:

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

Para disponibilizar esta página, vamos criar uma `TemplateView` diretamente no arquivo de URLs:

`project/urls.py`
```python
from django.contrib import admin
from django.views.generic import TemplateView
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='front-end/index.html')),
]
```

Normalmente criaríamos uma view dento de um arquivo `views.py` de uma *app*, mas como ela tem somente o propósito de renderizar um *template* sem nenhum objeto de contexto ou lógica associada, apenas adicioná-la à rota deixa explícito que ela não está associada a nenhuma app Django.

Por enquanto, se tentarmos rodar o servidor e abrir a página no *browser*, veremos uma mensagem de erro informando que não foi encontrado o arquivo `webpack-stats.json`. Então vamos à configuração do *front-end*.

## Iniciando o projeto do *front*

Para começar uma aplicação em React, um dos processos mais simples é usar o [create-react-app](https://github.com/facebook/create-react-app), que já instala e configura todas as bibliotecas necessárias para a aplicação. No entanto, a estrutura gerada por ele tem diversos elementos que não seriam necessários para o nosso caso. Além disso, ele esconde por trás de uma interface muito simples o que está sendo feito. Uma das grandes dificuldades para quem desenvolve originalmente para o *back-end* é entender o papel das diversas bibliotecas da *stack* de desenvolvimento Javascript, por isto escolhemos não utilizar este recurso.

Vamos começar inicializando um projeto com o **NPM** (Node Package Manager), o gerenciador de dependências para ambientes Javascript. Ele se encarrega de baixar, instalar e gerenciar versões de pacotes JS. Se você não tem o NPM instalado e tem dúvidas sobre como fazer isso, pode conferir a [documentação](https://nodejs.org/en/) ou, buscando no Google, seguir um tutorial com as instruções de instalação para diversas plataformas.

### [Passo 4](https://github.com/labcodes/django-react-webpack/releases/tag/4)

```
$ npm init
```

Ao rodar esse comando, vão aparecer diversas perguntas sobre o projeto. Se você não quiser repondê-las por enquanto, basta dar Enter em tudo e, se preferir, pode editar estes dados depois. Você pode também rodar `npm init -y` que tem o mesmo efeito. Ao final do processo, terá sido criado o arquivo `package.json` com as respostas que você deu
, nele ficarão armazenadas todas as versões de pacotes intalados pelo NPM, assim como os scripts que ele pode executar. Também deve aparecer o diretório `node_modules`, que armazena as bibliotecas baixadas por ele.

Depois disto vamos criar o diretório `src` dentro do nosso diretório de `assets` e, dentro dele, o diretório `js`. Em `assets/src/js`, criaremos o arquivo `index.js`, que será o ponto de entrada da aplicação.

```
$ mkdir -p assets/src/js
$ touch assets/src/js/index.js
```

## Configurando o Webpack

O Webpack é uma ferramenta para compilar recursos estáticos, tanto *scripts* quanto folhas de estilo, inclusive nos formatos *sass* e *less*, por exemplo. A partir de um arquivo de configuração, ele faz o trabalho de vigiar e compilar os recursos de forma que eles possam ser entregues diretamente para o browser.

Além do próprio Webpack, vamos intalar o *plugin* [Webpack Bundle Tracker](https://github.com/ezhome/webpack-bundle-tracker), que vai manter um registro do *status* atual do que está sendo gerenciado por ele.

```
$ npm install --save-dev webpack webpack-bundle-tracker
```

O parâmetro `--save-dev` do comando de instalação informa ao NPM que esta é uma dependência de desenvolvimento, ou seja, que este código não faz parte do que será compilado e mandado para o cliente no resultado final, mas servirá de suporte para a construção do código e só precisa estar presente no computador que está sendo usado para desenvolver a aplicação.

O arquivo `package.json` agora deve ter sido preenchido com o atributo `devDependencies` contendo as versões destes dois pacotes.

`package.json`
```json
...
"devDependencies": {
  "webpack": "^3.10.0",
  "webpack-bundle-tracker": "^0.2.1"
}
...
```

  **Dica**: Se você estiver usando GIT como sistema de controle de versões, adicione ao seu `.gitignore` o diretório `node_modules` e o arquivo `package-lock.json` que serão gerados pelo NPM. Além disso, caso não tenha mudado as configurações de banco de dados do Django e esteja usando o SQLite, inclua também o `db.sqlite3`.

### [Passo 5](https://github.com/labcodes/django-react-webpack/releases/tag/5)

Com o Webpack instalado podemos criar o arquivo de configuração para ele. É daí que ele vai obter todas as informações sobre onde e como compilar os recursos que ele vai gerenciar.

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

O que fizemos aqui foi:

  - Definir como ponto de entrada da applicação o arquivo `assets/src/js/index.js`.

  - Como saída para os `.js` compilados teremos um padrão de arquivos localizados em `assets/dist` compostos por um nome, que será "main" por *default*, e um *hash* aleatório.

  - Definir como `webpack-stats.json` o arquivo onde o Bundle Tracker armazenará o *status* final do processo, a mesma mensagem que aparece no terminal quando rodamos o Webpack.

Você pode mudar os nomes dos arquivos e diretórios para o que preferir, só lembre-se de mudar também nas configurações do Webpack Loader no `settings.py`.

Quando começarmos a compilar os arquivos, se houver uma mensagem de erro no `webpack-stats.json` e estivermos rodando o servidor com o parâmetro de `DEBUG = True`, a mensagem será exibida como erro 500 da mesma forma como são exibidos os erros do próprio Django.

Voltando ao `package.json`, vamos adicionar duas entradas de *scripts* para facilitar o processo de rodar o Webpack:

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

Agora, para compilar uma única vez os estáticos, podemos rodar no termnal o comando `npm run start`. Já para compilar em tempo real, atualizando o resultado de acordo com cada mudança nos arquivos, utilizaremos o `npm run watch`.

Se observar a árvore de diretórios do projeto, deve ter aparecido um novo chamado `dist` com um arquivo no formato `main-315df4b2f5abf7716c38.js` dentro de `assets`, além do arquivo `webpack-stats.json` na raíz do projeto.

Como o "watch" e o servidor do Django rodando já podemos abrir o endereço no browser e verificar que a aplicação está no ar.

  **Dica**: Se ao rodar o `npm run watch` ele terminar o processo e sair dele, ao invés de continuar aberto esperando mudanças nos arquivos, dê uma olhada [aqui](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers).
  Adicione também `dist` e o `webpack-stats.json` ao seu `.gitignore` caso esteja usando o GIT.

## Configurando o React

Até o momento, o *setup* que temos pode servir de base para qualquer *framework* Javascript que você queira usar para desenvolver sua aplicação. A partir daqui, vamos adicionar as configurações específicas do React.

```
$ npm install --save react react-dom
```

Repare que a intalação destes pacotes recebeu um parâmetro diferentes das outros até agora: em vez de `--save-dev` usamos somente `--save`. Isto porque, ao contrário do Webpack, que é uma dependência de desenvolvimento, o código do React vai ser compilado e disponibilizado no Javascript final entregue ao cliente.

Uma característica do React que difere ele de outros *frameworks* como Angular ou JQuery é o *virtual DOM*: ao invés de manipular os elementos já existentes no DOM, ele se encarrega de injetar todo o HTML que aparece para o usuário no elemento raíz da aplicação. É por isto que o template que criamos no Django possui apenas uma `div`, que receberá todo o conteúdo manipulado pelo React. Assim, ao invés de criar arquivos separados de `.html` e `.js`, os componentes do React são na verdade arquivos Javascript que já contêm o HTML que vão renderizar. Para isso, usa-se uma sintaxe especial chamada [JSX](https://reactjs.org/docs/introducing-jsx.html) que depois precisa ser transpilada para virar strings que podem ser lidas pelo interpretador do browser. Quem faz este trabalho de transpilar as sintexes especiais que vamos usar é o [Babel](https://babeljs.io/).

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

Agora podemos informar no `webpack.config.js` as regras que o Webpack deve utilizar quando for compilar os arquivos `.js` ou `.jsx`. Vamos definir que todo arquivo com estas extensões devem passar pelo *loader* do Babel, exceto os que estão no diretório `node_modules`, onde ficam as dependências do projeto.

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

Usamos o `ReactDOM` para procurar um elemento com o id `react-app` e renderizar dentro dele o HTML gerado pelo componente `App`.

### Organizando a aplicação

### [Passo 6](https://github.com/labcodes/django-react-webpack/releases/tag/6)

Há diversas possibilidades de organizar a arquitetura de um projeto React. Nós escolhemos aqui a estrutura que separa *components* e *containers*. Os primeiros são os blocos que serão usados para montar as páginas e podem ser reaproveitados em lugares diversos, já os outros representam as páginas em si, contendo o estado global do conteúdo visualizado pelo usuário.

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

No ponto de entrada não há mais nenhum componente sendo definido, ele apensas importa `App` do pacote de *containers*.

`assets/src/js/index.js`
```js
import React from 'react';
import ReactDOM from 'react-dom';

import App from './containers/App';

ReactDOM.render(<App />, document.getElementById('react-app'));
```

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

Agora podemos adicionar nossa primeira folha de estilos e importá-la no Javascript.

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
