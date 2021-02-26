# Cap 22 - Bonus Working with Webpack

# 002 Introducing Webpack
--> `Webpack` consiste de uma ferramenta que analisa as dependências do cógido entre diferentes arquivos 
e entre pacotes por meio das instruções de importação, e agrupa os mesmos no que é chamado de bundle, 
realizando pré-processamentos e otimizações sobre o mesmo.

# 003 How Webpack works
--> Uma vez especificado um entry point, Webpack realiza o percorrimento sobre o gráfico de dependências 
da solução. E antes produzir o bundle, o código encontrado é oferecido a utilitários para pré-processamento.
* `Loaders`: usualmente são pré-processadores que recebem o código e realizam a sua retrocompatibilidade 
ou tradução para a linguagem interpretada pelo browser, o que permite fazer uso de síntaxe e recursos a parte 
do que é oferecido em execução. Ex.: `babel-loader`, `css-loader`;
* `Plugins`: usualmente são programas que manipulam ou otimizam o código antes que o bundle seja produzido. 
Ex.: `uglify`.

# 004 Basic Workflow Requirements
--> Ao criar um projeto com `react-create-app`, Webpack é utilizado com o seguinte workflow:
* Retrocompatibilidade de recursos de nova geração do Javascript;
* Pré-processamento de código JSX;
* CSS autoprefixing;
* Tratamento de importações de assets como imagens;
* Otimização de código.

# 005 Project & npm Setup
--> Inicialização de um projeto:
```
npm init
npm install --save-dev webpack webpack-dev-server
```

--> Dentro da raiz do projeto, a seguinte estrutra pode ser utilizada:
```
src/
--> assets/
--> components/
--> containers/
--- App.js
--- index.html
--- index.js
--- index.css
```

--> O arquivo `index.html` precisa ter um elemento identificado que irá conter o conteúdo da aplicação:
```html
<html>
    <head>...</head>
    <body>
        <div id="root"></div>
    </body>
</html>
```

--> No arquivo `index.js`:
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';

const app = (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

ReactDOM.render(app, document.getElementById('root'));
```

--> No arquivo `App.js`:
```javascript
import React, { Component } from 'react';

class App extends Component {
    render () {
        return (
            <div>
                <p>Hello human!</p>
            </div>
        );
    }
}
```

# 008 Installing Production Dependencies
--> Instalação de denpendências: `npm install --save react react-dom react-router-dom`

# 009 Setting Up the Basic Webpack Config
--> Install do cli do webpack: `npm install --save-dev webpack-cli`

--> Configuração do script de inicialização no arquivo `package.json`:
```json
{
    "scripts": {
        "start": "webpack serve"
    }
}
```
* Ao executar `webpack serve` será procurado o arquivo de configuração `webpack.config.js` na raiz 
do projeto.

--> Arquivo `webpack.config.js`:
```javascript
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: ''
    },
    devtool: 'eval-cheap-module-source-map'
};
```
* `mode` identifica se o bundle deve ser tratado como destinado a ambiente de produção ou não;
* `entry`: indica o entry point da aplicação;
* `output`: especifica o caminho completo onde o bundle será produzido, assim como o path no qual as URLs 
devem se basear;
* `devtool`: especifica o utilitário que produzirá os source maps para debug.

# 010 Adding File Rules & Babel
--> `Babel` consite no loader que irá pré-processar a síntaxe JSX e retrocompatibilizar o javascript:
* Install: `npm install --save-dev @babel/core @babel/preset-env @babel/preset-react @babel/preset-stage-2 babel-loader @babel/plugin-proposal-class-properties`

--> Para utilizá-lo com webpack, é necessário definir o seu uso no arquivo de configuração do webpack:
```javascript
module.exports = {
    ...,
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node-modules/
            }
        ]
    }
};
```
* É especificado para quais arquivos webpack deve repasar para o loader, e quais devem ser excluídos.

--> Babel possui um arquivo próprio de configuração `.babelrc` onde é definido a utilização dos presets e 
seus plugins:
```json
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "browsers": ["> 1%", "last 2 versions"]
                }
            }
        ],
        "@babel/preset-react"
    ],
    "plugins": [
        "@babel/plugin-proposal-class-properties"
    ]
}
```
* É espeficiado a retrocompatibilidade que deve ser atendida, o preset de interpretação do JSX e o plugin 
que define a linguagem javascript utilizada.

# 011 Loading CSS Files
--> Pra pré-prossamento dos arquivos CSS são utilizados o `style-loader` e `css-loader`:
* Install: `npm install --save-dev style-loader css-loader`
* `css-loader`: identifica as importações de arquivos CSS;
* `style-loader`: introduz o código CSS na página html a ser servida.

--> Deve ser configurado no arquivo de configuração do webpack:
```javascript
module.exports = {
    ...,
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node-modules/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: {
                        importLoaders: 1,
                        modules: {
                            localIdentName: '[name]__[local]__[hash:base64:5]'
                        }
                    } }
                ]
            }
        ]
    }
};
```
* `localIdentName` define como o nome das classes CSS devem ser geradas.

--> CSS prefixing é realizado pelo loader `postcss-loader` com o pacote `autoprefixer`:
* Install: `npm install --save-dev postcss-loader autoprefixer`
* Configuração no arquivo do webpack:
```javascript
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

module.exports = {
    ...,
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node-modules/,
                use: [
                    { loader: 'postcss-loader', options: {
                        postcssOptions: {
                            ident: 'postcss'
                        }
                    } }
                ]
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname,
                postcss: [autoprefixer]
            }
        })
    ]
};
```
* Configurado range de compatibilidade do autoprefixer no arquivo package.json:
```json
{
    "browserslist": "> 1%, last 2 versions"
}
```

# 012 Loading Images & Injecting into HTML Page
--> Importações de assets como imagens são gerenciadas com o loader `url-loader` que faz uso loader `file-loader`:
* Install: `npm install --save-dev url-loader file-loader`
* Deve ser configurado no arquivo do webpack:
```javascript
module.exports = {
    ...,
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8000,
                    name: 'images/[name].[ext]'
                }
            }
        ]
    }
};
```
* É especificado os formatos reconhecidos e a pasta destino.

--> Para que os bundles javascript e css sejam linkados na página html, é necessário o plugin `html-webpack-plugin`:
* Install: `npm install --save-dev html-webpack-plugin`
* Deve ser configurado no arquivo do webpack:
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    ...,
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/src/index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ]
};
```
* É espeficiado o arquivo corresponde a página html, e o elemento html que receberá os links.

# 013 Production Workflow & Wrap Up
--> Para ter o bundle de produção, o arquivo `webpack.config.propd.js` pode ser criado, tendo `mode` e `devtool` 
com os valores:
```javascript
module.exports = {
    ...,
    mode: 'production',
    devtool: 'none'
};
```

--> E no arquivo package.json pode ser especificado um script para build que fará uso da configuração .prod:
```json
{
    "scripts": {
        "build:prod": "webpack --config webpack.config.propd.js"
    }
}
```
* Execução: `npm run build:prod`
