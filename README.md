


# Backend da aplicação Gympoint em Node.js

Parte do desafio final do curso Gostack 9 - Bootcamp Rocketseat.

## Para executar o projeto

Instale as dependências do projeto.

```console
yarn
```

Faça a configuração do banco de dados PostgreSQL.

Com o docker, crie um container do banco de dados e execute-o na porta de sua preferencia.

```console
docker run --name database -e POSTGRES_PASSWORD=docker -p 5433:5432 -d postgres:11

docker start database
```

Crie no seu banco de dados um database chamado gympoint. Pode ser usado um programa como o Postbird ou o DBeaver para esta finalidade.

Configure o arquivo src/config/database.js com as variáveis definidas do seu banco de dados.

Crie dados ficctícios no banco de dados com as seeds pré-definidas.

```console
yarn sequelize db:seed:all
```

Execute a aplicação.

```console
yarn dev
```

Com o backend configurado é possível acessar dados no [frontend em ReactJS](https://github.com/eduqg/GympointFront) e no [app mobile em React Native](https://github.com/eduqg/GympointReactNative) disponíveis no github.

## Comandos Utilizados


### Inicialização do projeto
```console
yarn init -y
```

```console
yarn add nodemon -D
```

Em package.json adicionar

```console
"scripts": {
  "dev":"nodemon src/server.js"
}
```

```console
yarn add sucrase -D
```

```console
yarn sucrase-node src/server.js
```

Trocar modo de importação de:

```console
const express = require('express');
```

Para:

```console
import express from 'express';
```

### Sucrase + Nodemon

Criar na pasta raiz nodemon.json. Quero que rode o node para cada arquivo js mas reqistre o sucrase. Antes de iniciar vai executar sucrase/register.

Iniciar configurações de debug clicando no 'inseto', add configuration e fazer alterações no arquivo launch.json

Iniciar aplicação com yarn dev:debug e colocar breackpoints desejados.

### Docker CE

Fazer a instalação
```console
docker run --name database -e POSTGRES_PASSWORD=docker -p 5433:5432 -d postgres:11
```

```console
docker ps = para ver containers.

docker ps -a = para ver todos.

docker stop database (ou o id).

docker start database

docker logs database
```

Outros comandos:

```console
docker stop $(docker ps -a -q) = para containers
docker rm $(docker ps -a -q) = remove containers
sudo service postgresql stop = para postgres do pc
sudo service postgresql start = inicia postgres do pc
```

Portanto:

Por ter postgres para outro projeto, deixar porta 5432 para ele.
Usar a porta 5433 para o GoBarber.

### Postbird
Para visualizar dados do postgres. Instalar e usar por exemplo:

```console
Host
localhost

Port
5433

Username
postgres

Password
docker
```

### Eslint

```console
yarn add eslint -D

yarn eslint --init
```

```console
? How would you like to use ESLint? To check syntax, find problems, and enforce code style

? What type of modules does your project use? JavaScript modules (import/export)

? Which framework does your project use? None of these
? Does your project use TypeScript? No

? Where does your code run? Node

? How would you like to define a style for your project? Use a popular style guide

? Which style guide do you want to follow? Airbnb (https://github.com/airbnb/javascript)

? What format do you want your config file to be in? JavaScript

Checking peerDependencies of eslint-config-airbnb-base@latest

The config that you ve selected requires the following dependencies:

eslint-config-airbnb-base@latest eslint@^5.16.0 || ^6.1.0 eslint-plugin-import@^2.18.2

? Would you like to install them now with npm? Yes
```

Excluir package.lock.json

Instalar dependencias

```console
yarn install
```

Para arrumar tudo em uma pasta, executar:
```console
yarn eslint --fix src --ext .js = para arrumar tudo em uma pasta
```

### Prettier
```console
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
```

Integrado ao ESLint
Tamanho de linhas

### Extensao editorconfig

Instalar pelo VSCode. Para diferentes editores de texto entre desenvolvedores. Configurar para padronizar.


### Postgres
Para usar postgres
```console
yarn add pg pg-hstore
```

### Sequelize

Para integração com postgres

```console
yarn add sequelize
```
Para ter comandos do sequelize

```console
yarn add sequelize-cli -D
```

Para criar migração inicial

```console
yarn sequelize migration:create --name=create-users
```

Para realizar migrações

```console
yarn sequelize db:migrate
```

Rollback

```console
yarn sequelize db:migrate:undo
```

```console
yarn sequelize db:migrate:undo:all
```

Seeds

Gerar Seed

```console
yarn sequelize seed:generate --name admin-user
```

Executar seed.

```console
yarn sequelize db:seed --seed admin-user
```

```console
yarn sequelize db:seed:all
yarn sequelize db:seed
```

### Jsonwebtoken

Para autenticação utilizando jwt.

```console
 yarn add jsonwebtoken
```
### Bcrypt
Para senha com hash
```console
yarn add bcryptjs
```

### Yup
Para validação de campos utilizando schemas.
```console
yarn add yup
```

### Biblioteca de datas

Usar versão mais atual.

```console
yarn add date-fns@next
```
