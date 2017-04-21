const express = require('express')
const path = require('path')
const app = express()

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname + '/assets/index.html'))
})

app.use(express.static('assets'))
app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist')))

function start(port) {
    app.listen(port, (err) => {
        if (err) {
            return console.log('server error', err)
        }

        console.log(`server is listening on ${port}`)
    })
}


module.exports = start