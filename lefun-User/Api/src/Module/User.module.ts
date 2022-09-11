import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common";
import { UserService } from "../Service/User.service";
import { LoginInfoService } from "../Service/LoginInfo.service";
import { VerifyService } from "../Service/Verify.service";
import { UserController } from "../Controller/User.controller";
import { Tappay } from "../Shared/ThirdPartyApi";
import { AuthMiddleware } from "../Shared/middlewares/AuthMiddleware";

@Module({
  providers: [UserService, LoginInfoService, VerifyService, Tappay],
  controllers: [UserController]
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "user/me", method: RequestMethod.GET },
        { path: "user/username", method: RequestMethod.PUT },
        { path: "user/verifycode", method: RequestMethod.PUT },
        { path: "user/recover", method: RequestMethod.GET },
        { path: "user/payment", method: RequestMethod.PUT },
        { path: "user/invoice/donate", method: RequestMethod.PUT },
        { path: "user/invoice/email", method: RequestMethod.PUT },
        { path: "user/invoice/device", method: RequestMethod.PUT }
      );
  }
}
