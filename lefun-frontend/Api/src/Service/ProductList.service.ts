import { Injectable } from "@nestjs/common";
import { getCustomRepository, In } from "typeorm";
import { ProductList } from "../Dao/models";
import { ProductListRepository } from "../Dao/repository";

@Injectable()
export class ProductListService {
  constructor() {}

  async findInTagIDs(tag_ids: string[]): Promise<ProductList[]> {
    {
      return getCustomRepository(ProductListRepository).find({
        select: ["title"],
        where: { tag_id: In(tag_ids) }
      });
    }
  }
}
