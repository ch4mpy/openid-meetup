export class KeycloakUser {
  sub: string;
  email: string;
  preferredUsername: string;
  roles: string[] = [];

  constructor(init?: Partial<KeycloakUser>) {
    Object.assign(this, init);
  }

  isBarman() {
    return this.roles.includes('barman');
  }

  static readonly ANONYMOUS = new KeycloakUser({});
}
