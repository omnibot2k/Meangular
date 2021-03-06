export class User {
  public _id?: string;
  public email: string;
  public password?: string;
  public confirmPassword?: string;
  public token: string;
  public roles: string[];
  public oauth?: string;
  public profile: {
    name: string
  };
}
