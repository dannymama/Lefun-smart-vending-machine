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

  async create(title:string, sub_title:string,context:string, imageURL:string,isHot:string):Promise<any>{
    let news = new News();
    news.context = context;
    news.imageURL = imageURL;
    news.isHot = isHot === '1'?true:false;
    news.title = title;
    news.sub_title = sub_title;
    return getCustomRepository(NewsRepository).save(news);
  }

  async updateById(id:number, title:string, sub_title:string,context:string, imageURL:string,isHot:string):Promise<any>{
    let news = new News();
    news.context = context;
    news.imageURL = imageURL;
    news.isHot = isHot === '1'?true:false;
    news.title = title;
    news.sub_title = sub_title;
    return getCustomRepository(NewsRepository).updateById(id,news)
  }

  async remove(id:number):Promise<any>{
    return getCustomRepository(NewsRepository).removeById(id);
  }
}
