"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.names = void 0;
const express_1 = require("express");
const namesController_1 = require("../controllers/namesController");
const router = (0, express_1.Router)();
exports.names = router;
router.get('/getNamesSync', namesController_1.namesController.getNamesSync);
router.get('/getNamesAsync', namesController_1.namesController.getNamesAsync);
router.get('/getNamesBatchingAsync', namesController_1.namesController.getNamesBatchingAsync);