const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

app.get('/search', (req, res) => {
    
    const {phrase} = req.body;

    res.status(200).send({
        "results":[
            phrase + "TheGame",
            phrase + "BoardGame",
            phrase,
        ] 
    })

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
