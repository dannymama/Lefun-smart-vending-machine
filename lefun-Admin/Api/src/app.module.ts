import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import { NewsModule } from "./Module/News.module";
// import { SMSAuthModule } from "./Module/SMSAuth.module";
import { UserModule } from "./Module/User.module";
import { LefunTransactionModule } from "./Module/LefunTransaction.module";
import { PerchaseModule } from "./Module/Perchase.module";
import { BackendUserModule } from "./Module/BackendUser.module";

import { config } from "./Config/config";

@Module({
  imports: [
    TypeOrmModule.forRoot(config.ORM_CONFIGURATION),
    NewsModule,
    UserModule,
    LefunTransactionModule,
    PerchaseModule,
    BackendUserModule
  ],
  controllers: [AppController],
  providers: []
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
