"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const express = require("express");
const tslog_1 = require("tslog");
const names_1 = require("./routes/names");
const log = new tslog_1.Logger();
const app = express();
const port = config_1.default.PORT;
app.use('/', names_1.names);
app.listen(port, function () {
    log.silly(`Example app listening on port ${port}!`);
});
