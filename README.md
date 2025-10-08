# comandos git

## git log

Listar os commits que fiz

## listar configurações do git

git config --list

git config --system = qualquer usuário e projeto no computador

git config --global = meu usuário pra qualquer projeto

git config --local = apenas para o projeto escolhido

## criando atalhos no git

git config --global --edit -> editar pelo VI

git config --global core.editor code
(OBS: depois de executar esse comando, executar novamente o 'git config --global --edit')

## padrão de commit

link: https://www.conventionalcommits.org/en/v1.0.0/

## lib para padrão de commit:

npm i -D git-commit-msg-linter

## lib -> instalando typescript

npm i -D typescript @types/node

## Atribuindo mais coisas ao commit anterior

git commit --amend --no-edit

## lib -> instalando husky

npm install husky --save-dev

## lib -> jest para TDD

npm i -D jest @types/jest ts-jest

// TODO secao 7 - aula 20 - MINUTO 22:23
