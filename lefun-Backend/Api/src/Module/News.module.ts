import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { NewsService } from "../Service/News.service";
import { NewsController } from "../Controller/News.controller";

@Module({
  providers: [NewsService],
  controllers: [NewsController]
})
export class NewsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {}
}
