import { EntityRepository, Repository } from "typeorm";
import { ProductList } from "../models";

@EntityRepository(ProductList)
export class ProductListRepository extends Repository<ProductList> {
  public findOneByTagId(tag_id: number): Promise<ProductList> {
    return this.manager.findOne(ProductList, { where: { tag_id } });
  }
}
