import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common";
import { LefunTransactionService } from "../Service/LefunTransaction.service";
import { LefunTransController } from "../Controller/LefunTransaction.controller";
import { Hash } from "../Shared/hash";
import { AuthMiddleware } from "../Shared/middlewares/AuthMiddleware";
import { ECPAYInvoice } from "../Shared/ThirdPartyApi";

@Module({
  providers: [LefunTransactionService, Hash, ECPAYInvoice],
  controllers: [LefunTransController]
})
export class LefunTransactionModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({
        path: "lefuntrans/invoice_detail",
        method: RequestMethod.GET
      });
  }
}
