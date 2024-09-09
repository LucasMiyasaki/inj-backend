import { createHash, randomBytes } from "crypto";

export default class UserPassword {
  public constructor(public readonly password: string) {}

  hash(): string {
    const convert = randomBytes(32).toString("hex");
    const hashPassword = createHash("sha256")
      .update(this.password + convert)
      .digest("hex");

    const password = `${convert}:${hashPassword}`;

    return password;
  }

  compare(hash: string): boolean {
    const [convert, storedHashPassword] = hash.split(":");
    const hashAux = createHash("sha256")
      .update(this.password + convert)
      .digest("hex");

    return storedHashPassword === hashAux;
  }
}
