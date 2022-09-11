import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common";
import { LefunTransactionService } from "../Service/LefunTransaction.service";
import { LefunTransController } from "../Controller/LefunTransaction.controller";
import { Hash } from "../Shared/hash";
import { LoginInfoModule } from "./LoginInfo.module";
import { AuthMiddleware } from "../Shared/middlewares/AuthMiddleware";
import { ECPAYInvoice } from "../Shared/ThirdPartyApi";

@Module({
  imports: [LoginInfoModule],
  providers: [LefunTransactionService, Hash, ECPAYInvoice],
  controllers: [LefunTransController]
})
export class LefunTransactionModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "lefunTrans", method: RequestMethod.POST },
        {
          path: "lefunTrans/invoice_detail/:lefun_transaction_id",
          method: RequestMethod.GET
        },
        { path: "lefunTrans", method: RequestMethod.GET }
      );
  }
}
