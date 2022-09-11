import * as crypto from "crypto";
import { config } from "../Config/config";

export class Hash {
  public async md5Salt(content: string): Promise<string> {
    let temp = crypto
      .createHash("md5")
      .update(content)
      .digest("hex");
    let result = crypto
      .createHash("md5")
      .update(temp + config.MD5SALT)
      .digest("hex");
    return result;
  }
}
