import { JwtPayload, sign, verify } from "jsonwebtoken";

export default class JWT {
  private readonly secretToken: string;

  constructor() {
    this.secretToken = String(process.env.JWT);
  }

  generate(id: number, type: string): string {
    const token = sign({ id, type }, this.secretToken, {
      expiresIn: "1d",
    });

    return token;
  }

  verify(token: string): JwtPayload | undefined {
    try {
      const jwtPayload = verify(token, this.secretToken) as JwtPayload;

      return jwtPayload;
    } catch (e) {
      return undefined;
    }
  }
}
