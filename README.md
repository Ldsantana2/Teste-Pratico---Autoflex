# Desafio Técnico - Full Stack Developer (Autoflex)

Este repositório contém a solução para o desafio técnico de Desenvolvedor da Autoflex. O projeto consiste em um sistema de gerenciamento de inventário industrial, focado no controle de insumos, precificação de produtos e cálculo automático de capacidade de produção.

Link do Sistema em Produção: https://teste-pratico-autoflex-1.onrender.com/

(Nota: Por estar em um ambiente gratuito da Render, os servidores podem levar cerca de 30~60 segundos para inciar no primeiro acesso).

## Tecnologias Utilizadas

### Back-end

Java 25 com Quarkus: Framework moderno para aplicações Java nativas.

PostgreSQL: Banco de dados relacional para persistência de dados.

Hibernate Panache: Facilitação da camada de persistência (ORM).

JUnit 5 & RestAssured: Testes unitários e de integração da API.

### Front-end

React & Redux: Biblioteca principal e gerenciamento de estado global.

Axios: Cliente HTTP para comunicação com a API.

Cypress: Testes de ponta a ponta (E2E) para garantir o fluxo do usuário.

## Como Executar o Projeto

Pré-requisitos
Docker e Docker Compose instalados.

### Execução via Docker (Ambiente Completo)

Para subir o Back-end, Front-end e Banco de Dados de uma vez:
`git clone https://github.com/Ldsantana2/Teste-Pratico---Autoflex.git
cd Teste-Pratico---Autoflex
docker-compose up --build
Front-end: http://localhost:3000
Back-end: http://localhost:8080`

## Suíte de Testes

O projeto foi desenvolvido contando com testes automatizados no back e no front.

### Testes de Back-end (Unitários e Integração)

Utilizam JUnit 5 e RestAssured para validar os endpoints e as regras de negócio.
`cd inventory-api
./mvnw test`

### Testes de Front-end (E2E com Cypress)

Testes que simulam o comportamento real do usuário no navegador.
`cd inventory-web`

#### Para abrir a interface do Cypress:

`npx cypress open`

### Para rodar em modo headless (terminal):

`npx cypress run`

## Endpoints Principais (API)

### Insumos (Raw Materials)

GET /materials - Lista todos os insumos.
POST /materials - Cadastra novo insumo (JSON: name, stockQuantity).
PUT /materials/{id} - Atualiza dados do insumo.
DELETE /materials/{id} - Remove um insumo.

### Produtos (Products)

GET /products - Lista produtos e suas composições.
POST /products - Cria produto vinculando insumos (JSON: name, price, materials).
PUT /products/{id} - Atualiza informações do produto ou sua composição.
DELETE /products/{id} - Remove o produto.

## Desenvolvido por Lucas Dantas.
