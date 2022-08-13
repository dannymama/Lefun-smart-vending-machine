import { Injectable } from "@nestjs/common";
import { getCustomRepository } from "typeorm";
import { News } from "../Dao/models";
import { NewsRepository } from "../Dao/repository";

@Injectable()
export class NewsService {
  constructor() {}

  async find(limit: number, offset: number): Promise<[News[], number]> {
    return getCustomRepository(NewsRepository).findAndCount({
      select: ["id", "title", "sub_title", "imageURL", "isHot", "createdAt"],
      order: {
        createdAt: "DESC"
      },
      skip: offset,
      take: limit
    });
  }

  async findOneByID(id: string): Promise<News> {
    return getCustomRepository(NewsRepository).findOne({
      where: { id }
    });
  }
}
