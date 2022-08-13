import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { SMSAuthService } from "../Service/SMSAuth.service";
import { SMSAuthController } from "../Controller/SMSAuth.controller";
import { SMSExpress } from "../Shared/ThirdPartyApi";

@Module({
  providers: [SMSAuthService, SMSExpress],
  controllers: [SMSAuthController]
})
export class SMSAuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {}
}
