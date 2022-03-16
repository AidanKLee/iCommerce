const bodyParser = require('body-parser');

const parser = {};
parser.json = bodyParser.json();
parser.urlEncoded = bodyParser.urlencoded({ extended: false });

module.exports = {
    parser
}