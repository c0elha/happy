<h1 align="center">
    <img alt="Happy" title="Happy" src="../web/src/images/logo.svg" />
</h1>

<p align="center">
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-setup">Setup</a>
</p>

<br>

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Node.js](https://nodejs.org)
- [TypeScript](https://www.typescriptlang.org/)

## 💻 Projeto

O Happy é uma aplicação que conecta pessoas à casas de acolhimento institucional para fazer o dia de muitas crianças mais feliz 💜

## :books: Documentação
Para a execução do projeto é necessário iniciar separadamente
- Server (você está aqui)
- [Web](web/README.md)
- [Mobile](mobile/README.md)

## Requisitos
- Yarn
- Instalação do [Node.js](https://nodejs.org) 

## Setup
### Etapas para a execução do projeto server

#### Clonar o repositório e estar dentro da pasta <kbd>server</kbd>
```

#### Instalar dependências 

``` sh
yarn install
```

#### Criar banco de dados (apenas uma vez)
``` sh
yarn typeorm migration:run
```


#### Executar projeto em modo desenvolvedor

``` sh
yarn server
```

---

Feito com 💜 durante a semana Next Level Week da Rocketseat.