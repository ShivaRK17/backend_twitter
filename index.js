const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const cors = require('cors')

require('./db/conn')
app.use(cors({
  origin: '*'
}));
app.use(express.json())

//Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/tweet',require('./routes/tweet'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})