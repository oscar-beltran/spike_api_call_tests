import axios from 'axios';
import config from "../config";

import { Logger, ILogObj } from "tslog";
import { IServiceResult } from "../models/names.interface";

const log: Logger<ILogObj> = new Logger();
const mockEndpoint = config.NAMES_API_ENDPOINT;
// Se define el tamaño máximo de peticiones que se harán dentro de un mismo lote
const batchSize: number = config.BATCH_SIZE;

export class NamesService {

  static async getNamesSync() {
    log.info('Probando la solución secuencial');
    // Se hace el primer llamado para conocer la info básica para la paginación
    const pagesSize = 2; // Valor dummy, el mock no soporta el atributo pageSize
    const firstCall: IServiceResult = await this.callMock(pagesSize, 0);

    // Se hacen los cálculos para la paginación
    const totalResults: number = firstCall.total;
    log.debug(`Hay ${totalResults} personas en total`);
    const totalPages: number = Math.ceil(totalResults/pagesSize);
    log.debug(`Actualmente hay ${totalPages} páginas de resultados`);

    // Inicia el llamado secuencial al servicio y construcción de la respuesta
    const listResult = firstCall.data;
    for (let page = 1; page < totalPages; page++) {
      const result: IServiceResult = await this.callMock(pagesSize, page);
      listResult.push(...result.data);
    }
    log.info('Se han recuperado todas las páginas');
    return listResult;
  }

  static async getNamesAsync() {
    log.info('Probando la solución asíncrona');
    // Se hace el primer llamado para conocer la info básica para la paginación
    const pagesSize = 2; // Valor dummy, el mock no soporta el atributo pageSize
    const firstCall: IServiceResult = await this.callMock(pagesSize, 0);

    // Se hacen los cálculos para la paginación
    const totalResults: number = firstCall.total;
    log.debug(`Hay ${totalResults} personas en total`);
    const totalPages: number = Math.ceil(totalResults/pagesSize);
    log.debug(`Actualmente hay ${totalPages} páginas de resultados`);

    // Inicia el llamado asíncrono al servicio
    const listResultAsync: Array<Promise<IServiceResult>> = [];
    for (let page = 1; page < totalPages; page++) {
      const result: Promise<IServiceResult> = this.callMock(pagesSize, page);
      listResultAsync.push(result);
    }
    // Espera el resultado de todas las promesas
    const promisesList: IServiceResult[] = await Promise.all(listResultAsync);
    // Construye la respuesta
    const anotherResults: any[] = [];
    promisesList.forEach(x => {
      anotherResults.push(...x.data);
    });
    log.info('Se han recuperado todas las páginas');
    return [...firstCall.data, ...anotherResults];
  }

  public static async getNamesBatchingAsync(): Promise<any[]> {
    log.info(`Probando la solución asíncrona por lotes de tamaño ${batchSize}`);
    // Se hace el primer llamado para conocer la info básica para la paginación
    const pagesSize = 2; // Valor dummy, el mock no soporta el atributo pageSize
    const firstCall: IServiceResult = await this.callMock(pagesSize, 0);

    // Se hacen los cálculos para la paginación
    const totalResults: number = firstCall.total;
    log.debug(`Hay ${totalResults} personas en total`);
    const totalPages: number = Math.ceil(totalResults/pagesSize);
    log.debug(`Actualmente hay ${totalPages} páginas de resultados`);

    // Inicia el llamado asíncrono por lotes al servicio
    const listResultAsync: Array<Promise<IServiceResult[]>> = [];
    for (let batchStart = 1; batchStart <= totalPages; batchStart += batchSize) {
      // Controla que no se busquen más páginas que las existentes
      const batchEnd = Math.min(batchStart + batchSize - 1, totalPages);

      const batchPromises: Array<Promise<IServiceResult>> = [];
      for (let page = batchStart; page <= batchEnd; page++) {
          const result: Promise<IServiceResult> = this.callMock(pagesSize, page);
          batchPromises.push(result);
      }
      // Se espera el resultado de los llamados al servicio que se hicieron en el lote
      const batchResult: IServiceResult[] = await Promise.all(batchPromises);
      listResultAsync.push(Promise.resolve(batchResult));
    }

    // Espera el resultado de todas las promesas que se construyeron en el ciclo anterior
    const batches: IServiceResult[][] = await Promise.all(listResultAsync);

    // Construye la respuesta
    const allResults: any[] = [];
    batches.forEach(batchResults => {
        batchResults.forEach(result => {
            allResults.push(...result.data);
        });
    });
    log.info('Se han recuperado todas las páginas');
    return [...firstCall.data, ...allResults];
  }

  private static async callMock(pagesSize: number, page = 0): Promise<IServiceResult> {
    log.debug(`Buscando la página número: ${page}`);
    const result = await axios({
      method: 'get',
      url: mockEndpoint,
      params: {
        page,
        pagesSize
      }
    });
    return result.data;
  }
 
}
