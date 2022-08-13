import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common";
import { PerchaseService } from "../Service/Perchase.service";
import { PerchaseController } from "../Controller/Perchase.controller";
import { Hash } from "../Shared/hash";
import { Tappay, ECPAYInvoice } from "../Shared/ThirdPartyApi";
import { AuthMiddleware } from "../Shared/middlewares/AuthMiddleware";

@Module({
  providers: [PerchaseService, Hash, Tappay, ECPAYInvoice],
  controllers: [PerchaseController],
  exports: [PerchaseService]
})
export class PerchaseModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      // { path: "perchase/:id", method: RequestMethod.GET },
      { path: "perchase/:limit/:offset", method: RequestMethod.GET },
      { path: "perchase/to_invoice", method: RequestMethod.GET }
    );
  }
}
