var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const PORT = process.env.PORT || 5050
var startPage = "register.html";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const { addUser } = require('./utils/ShahinaUtil');
app.post('/add-User', addUser);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
})

const { viewTasks } = require('./utils/RaeleneViewTasksUtil');
app.get('/view-tasks', viewTasks)

server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' :
        address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});
module.exports = { app, server }