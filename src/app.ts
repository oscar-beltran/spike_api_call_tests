import config from './config';
import express = require('express');

import { Logger, ILogObj } from "tslog";
import { names } from './routes/names';

const log: Logger<ILogObj> = new Logger();
const app: express.Application = express();
const port = config.PORT;

app.use('/', names);

app.listen(port, function () {
  log.silly(`Example app listening on port ${port}!`);
});