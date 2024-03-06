"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamesService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const tslog_1 = require("tslog");
const log = new tslog_1.Logger();
const mockEndpoint = config_1.default.NAMES_API_ENDPOINT;
// Se define el tamaño máximo de peticiones que se harán dentro de un mismo lote
const batchSize = config_1.default.BATCH_SIZE;
class NamesService {
    static getNamesSync() {
        return __awaiter(this, void 0, void 0, function* () {
            log.info('Probando la solución secuencial');
            // Se hace el primer llamado para conocer la info básica para la paginación
            const pagesSize = 2; // Valor dummy, el mock no soporta el atributo pageSize
            const firstCall = yield this.callMock(pagesSize, 0);
            // Se hacen los cálculos para la paginación
            const totalResults = firstCall.total;
            log.debug(`Hay ${totalResults} personas en total`);
            const totalPages = Math.ceil(totalResults / pagesSize);
            log.debug(`Actualmente hay ${totalPages} páginas de resultados`);
            // Inicia el llamado secuencial al servicio y construcción de la respuesta
            const listResult = firstCall.data;
            for (let page = 1; page < totalPages; page++) {
                const result = yield this.callMock(pagesSize, page);
                listResult.push(...result.data);
            }
            log.info('Se han recuperado todas las páginas');
            return listResult;
        });
    }
    static getNamesAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            log.info('Probando la solución asíncrona');
            // Se hace el primer llamado para conocer la info básica para la paginación
            const pagesSize = 2; // Valor dummy, el mock no soporta el atributo pageSize
            const firstCall = yield this.callMock(pagesSize, 0);
            // Se hacen los cálculos para la paginación
            const totalResults = firstCall.total;
            log.debug(`Hay ${totalResults} personas en total`);
            const totalPages = Math.ceil(totalResults / pagesSize);
            log.debug(`Actualmente hay ${totalPages} páginas de resultados`);
            // Inicia el llamado asíncrono al servicio
            const listResultAsync = [];
            for (let page = 1; page < totalPages; page++) {
                const result = this.callMock(pagesSize, page);
                listResultAsync.push(result);
            }
            // Espera el resultado de todas las promesas
            const promisesList = yield Promise.all(listResultAsync);
            // Construye la respuesta
            const anotherResults = [];
            promisesList.forEach(x => {
                anotherResults.push(...x.data);
            });
            log.info('Se han recuperado todas las páginas');
            return [...firstCall.data, ...anotherResults];
        });
    }
    static getNamesBatchingAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            log.info(`Probando la solución asíncrona por lotes de tamaño ${batchSize}`);
            // Se hace el primer llamado para conocer la info básica para la paginación
            const pagesSize = 2; // Valor dummy, el mock no soporta el atributo pageSize
            const firstCall = yield this.callMock(pagesSize, 0);
            // Se hacen los cálculos para la paginación
            const totalResults = firstCall.total;
            log.debug(`Hay ${totalResults} personas en total`);
            const totalPages = Math.ceil(totalResults / pagesSize);
            log.debug(`Actualmente hay ${totalPages} páginas de resultados`);
            // Inicia el llamado asíncrono por lotes al servicio
            const listResultAsync = [];
            for (let batchStart = 1; batchStart <= totalPages; batchStart += batchSize) {
                // Controla que no se busquen más páginas que las existentes
                const batchEnd = Math.min(batchStart + batchSize - 1, totalPages);
                const batchPromises = [];
                for (let page = batchStart; page <= batchEnd; page++) {
                    const result = this.callMock(pagesSize, page);
                    batchPromises.push(result);
                }
                // Se espera el resultado de los llamados al servicio que se hicieron en el lote
                const batchResult = yield Promise.all(batchPromises);
                listResultAsync.push(Promise.resolve(batchResult));
            }
            // Espera el resultado de todas las promesas que se construyeron en el ciclo anterior
            const batches = yield Promise.all(listResultAsync);
            // Construye la respuesta
            const allResults = [];
            batches.forEach(batchResults => {
                batchResults.forEach(result => {
                    allResults.push(...result.data);
                });
            });
            log.info('Se han recuperado todas las páginas');
            return [...firstCall.data, ...allResults];
        });
    }
    static callMock(pagesSize_1) {
        return __awaiter(this, arguments, void 0, function* (pagesSize, page = 0) {
            log.debug(`Buscando la página número: ${page}`);
            const result = yield (0, axios_1.default)({
                method: 'get',
                url: mockEndpoint,
                params: {
                    page,
                    pagesSize
                }
            });
            return result.data;
        });
    }
}
exports.NamesService = NamesService;
