const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/dist'));


app.get('*', function (_request, response) {
    response.sendFile(path.resolve(__dirname, './dist/index.html'));
  });

app.listen(process.env.PORT || 8080, () => console.log('News app listening on port 8080!'))