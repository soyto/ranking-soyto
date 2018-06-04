let express = require('express');
let app = express();


app.use('/seo/', require('./nodeApp/express-routes/seo'));


app.listen(8080);