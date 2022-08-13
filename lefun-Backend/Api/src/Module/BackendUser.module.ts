import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common";
import { BackendUserService } from "../Service/BackendUser.service";
import { BackendUserController } from "../Controller/BackendUser.controller";
import { AuthMiddleware } from "../Shared/middlewares/AuthMiddleware";

@Module({
  providers: [BackendUserService],
  controllers: [BackendUserController]
})
export class BackendUserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "backend_user", method: RequestMethod.POST },
        { path: "backend_user", method: RequestMethod.DELETE },
        { path: "backend_user", method: RequestMethod.PUT }
      );
  }
}
