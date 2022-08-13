import { Get, Controller, Param } from "@nestjs/common";
import { NewsService } from "../Service/News.service";
import { findContentDto, findAllDto } from "../Dto/News.dto";
import { getReturnObj, ResultCode, ReturnObj } from "../Shared/enums";
import { ApiOperation } from "@nestjs/swagger";

@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get("content/:id")
  @ApiOperation({
    title: "取得最新消息細部資訊",
    description: "取得最新消息細部資訊"
  })
  async findContent(@Param() param: findContentDto): Promise<ReturnObj> {
    let result = await this.newsService.findOneByID(param.id);
    return getReturnObj(ResultCode.SUCCESS, result);
  }

  @Get(":limit/:offset")
  @ApiOperation({
    title: "取得最新消息",
    description: "取得最新消息"
  })
  async findAll(@Param() param: findAllDto): Promise<ReturnObj> {
    let [news, counts] = await this.newsService.find(param.limit, param.offset);
    return getReturnObj(ResultCode.SUCCESS, { news: news, count: counts });
  }
}
