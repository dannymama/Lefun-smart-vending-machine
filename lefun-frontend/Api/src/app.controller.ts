import { Get, Controller } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  root(): string {
    return "Lefun Frontend API";
  }
}
