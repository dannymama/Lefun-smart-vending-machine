import { Get, Controller, Param,Post, Body,Put, Delete } from "@nestjs/common";
import { NewsService } from "../Service/News.service";
import { findContentDto, findAllDto, createDto, updateDto,deleteDto } from "../Dto/News.dto";
import { getReturnObj, ResultCode, ReturnObj } from "../Shared/enums";

@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get("content/:id")
  async findContent(@Param() param: findContentDto): Promise<ReturnObj> {
    let result = await this.newsService.findOneByID(param.id);
    return getReturnObj(ResultCode.SUCCESS, result);
  }

  @Get(":limit/:offset")
  async findAll(@Param() param: findAllDto): Promise<ReturnObj> {
    let [news, counts] = await this.newsService.find(param.limit, param.offset);
    return getReturnObj(ResultCode.SUCCESS, { news: news, count: counts });
  }

  @Post()
  async createNews(@Body() param: createDto): Promise<ReturnObj> {
    await this.newsService.create(param.title, param.sub_title,param.context, param.imageURL,param.isHot);
    return getReturnObj(ResultCode.SUCCESS);
  }

  @Put()
  async updateNews(@Body() param: updateDto): Promise<ReturnObj> {
    await this.newsService.updateById(param.id,param.title, param.sub_title,param.context, param.imageURL,param.isHot);
    return getReturnObj(ResultCode.SUCCESS);
  }

  @Delete()
  async deleteNews(@Body() param: deleteDto): Promise<ReturnObj> {
    await this.newsService.remove(param.id);
    return getReturnObj(ResultCode.SUCCESS);
  }
}
