import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common";
import { LoginInfoService } from "../Service/LoginInfo.service";
import { VerifyService } from "../Service/Verify.service";
import { LoginInfoController } from "../Controller/LoginInfo.controller";
import { AuthMiddleware } from "../Shared/middlewares/AuthMiddleware";

@Module({
  providers: [LoginInfoService, VerifyService],
  controllers: [LoginInfoController],
  exports: [LoginInfoService]
})
export class LoginInfoModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: "logininfo", method: RequestMethod.DELETE });
  }
}
