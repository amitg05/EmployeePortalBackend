require('dotenv').config();
const app = require('./config/express')
const port = parseInt(process.env.PORT, 10) || 3000;



app.listen(port, () => {
    console.log(`Server Listening On Port ${port}`);
})

module.exports = app;