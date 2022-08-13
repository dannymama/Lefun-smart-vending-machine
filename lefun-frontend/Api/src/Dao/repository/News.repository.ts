import { EntityRepository, Repository } from "typeorm";
import { News } from "../models";

@EntityRepository(News)
export class NewsRepository extends Repository<News> {
  public findOneById(id: number): Promise<News> {
    return this.manager.findOne(News, { where: { id } });
  }

  public async removeById(id: number): Promise<News> {
    const itemToRemove: News = await this.findOne({ id });
    return this.manager.remove(itemToRemove);
  }
}
