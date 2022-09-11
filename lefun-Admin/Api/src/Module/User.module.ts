import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common";
import { UserService } from "../Service/User.service";
import { LoginInfoService } from "../Service/LoginInfo.service";
import { BehaviorLogService } from "../Service/BehaviorLog.service";
import { VerifyService } from "../Service/Verify.service";
import { PerchaseModule } from "../Module/Perchase.module";
import { UserController } from "../Controller/User.controller";
import { Tappay } from "../Shared/ThirdPartyApi";
import { AuthMiddleware } from "../Shared/middlewares/AuthMiddleware";

@Module({
  imports: [PerchaseModule],
  providers: [
    UserService,
    LoginInfoService,
    BehaviorLogService,
    VerifyService,
    Tappay
  ],
  controllers: [UserController]
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: "lefun_user/:phone_number", method: RequestMethod.GET },
      {
        path:
          "lefun_user/behavior_log/:phone_number/:limit/:offset/:start_time/:end_time",
        method: RequestMethod.GET
      },

      {
        path:
          "lefun_user/perchase_log/:phone_number/:limit/:offset/:start_time/:end_time",
        method: RequestMethod.GET
      },

      { path: "lefun_user/username", method: RequestMethod.PUT }
    );
  }
}
