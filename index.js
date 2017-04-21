const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname + '/assets/index.html'))
})

app.use(express.static('assets'))
app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist')))

app.listen(port, (err) => {
    if (err) {
        return console.log('server error', err)
    }

    console.log(`server is listening on ${port}`)
})