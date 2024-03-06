import { NamesService } from '../services/nameService';

const namesController = {

  async getNamesSync(req: any, res: any) {
    res.send(await NamesService.getNamesSync());
  },
  async getNamesAsync(req: any, res: any) {
    res.send(await NamesService.getNamesAsync());
  },
  async getNamesBatchingAsync(req: any, res: any) {
    res.send(await NamesService.getNamesBatchingAsync());
  }

};

export { namesController };
