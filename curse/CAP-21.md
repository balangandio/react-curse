# Cap 21 - Deploying the App to the Web

# 002 Deployment Steps
--> Como uma aplicação React é uma SPA em javascript, devem ser observados alguns pontos comuns a este 
tipo de aplicação.
* `Basepath`: caso a solução não seja disponibilizada na raiz `/` do servidor, deve ser especificado o 
basename no componente `<BrowserRouter basename="/my-app/">`;
* `Build e otimização`: o bundle deve ser otimizado para produção, `npm run build`;
* `index.html`: o servidor web utilizado deve ser configurado para sempre servir a página index;
* `Static server`: o servidor web precisa apenas servidor os arquivos, não precisa ser utilizado servidores 
de aplicação.

# 003 Building the Project
--> O projeto por ser contruído com o comando `npm run build`. Será gerado uma pasta chamada `build`. 
Todo o conteúdo da pasta deve ser disponibilizado pelo servidor web.