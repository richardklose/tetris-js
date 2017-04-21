#!/usr/bin/env node
const program = require('commander')
const path = require('path')
const version = require(path.join(__dirname, '/../package.json')).version
const app = require(path.join(__dirname, '/../index.js'))

program
    .version(version)
    .option('-p, --port [value]', 'The listen port')
    .parse(process.argv)

app(program.port ? parseInt(program.port) : 3000)