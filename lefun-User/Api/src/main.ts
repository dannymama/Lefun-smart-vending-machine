import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "./Shared/pipes/validation.pipe";
import { cpus } from "os";
import { resolve } from "path";
import { env } from "process";
import { config, isProduction } from "./Config/config";

import * as fs from "fs";
import * as cluster from "cluster";
import * as dotenv from "dotenv";
import * as cors from "cors";

dotenv.config({ path: resolve() + "/.env" });

if (cluster.isMaster) {
  console.log(`\n -------------------> RUN ${env.NODE_ENV} ENVIRONMENT \n`);
  for (const _ of cpus()) {
    cluster.fork();
    if (!isProduction()) {
      break;
    }
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      "Worker " +
        worker.process.pid +
        " died with code: " +
        code +
        ", and signal: " +
        signal
    );
    console.log("Starting a new worker");
    cluster.fork();
  });
} else {
  const port: number = Number(env.PORT) || config.PORT_APP || 3000;

  async function bootstrap() {
    let appOptions: any = {
      cors: true
    };
    if (isProduction()) {
      appOptions.httpsOptions = {
        key: fs.readFileSync("./secrets/server.key"),
        cert: fs.readFileSync("./secrets/server.cert")
      };
    }

    const app = await NestFactory.create(ApplicationModule, appOptions);
    app.setGlobalPrefix("api");
    app.useGlobalPipes(new ValidationPipe());
    const options = new DocumentBuilder()
      .setTitle("樂坊智能取物前端應用api")
      .setDescription("提供接口供樂坊前端服務相關功能呼叫")
      .setVersion("1.0")
      .setBasePath("api")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("/docs", app, document);
    app.use((req, res, next): void => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "X-Requested-With, Content-Type, Authorization"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET,PUT,PATCH,POST,DELETE,OPTIONS"
      );
      res.header("Access-Control-Expose-Headers", "token");
      next();
    });
    app.use(cors());

    await app.listen(8080);
    console.log(
      "Server is running in process " +
        process.pid +
        " listening on PORT " +
        port +
        "\n"
    );
  }
  bootstrap();
}
