import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import { NewsModule } from "./Module/News.module";
import { SMSAuthModule } from "./Module/SMSAuth.module";
import { UserModule } from "./Module/User.module";
import { LoginInfoModule } from "./Module/LoginInfo.module";
import { LefunTransactionModule } from "./Module/LefunTransaction.module";
import { PerchaseModule } from "./Module/Perchase.module";

import { config } from "./Config/config";

@Module({
  imports: [
    TypeOrmModule.forRoot(config.ORM_CONFIGURATION),
    NewsModule,
    SMSAuthModule,
    UserModule,
    LoginInfoModule,
    LefunTransactionModule,
    PerchaseModule
  ],
  controllers: [AppController],
  providers: []
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
