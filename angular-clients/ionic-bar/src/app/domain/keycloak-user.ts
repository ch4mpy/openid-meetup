export class KeycloakUser {
  sub: string;
  preferredUsername: string;
  roles: string[] = [];

  constructor(init?: Partial<KeycloakUser>) {
    Object.assign(this, init);
  }

  isAuthenticated(): boolean {
    return !!this.sub;
  }

  isBarman(): boolean {
    return this.roles.includes('BARMAN');
  }

  static readonly ANONYMOUS = new KeycloakUser({});
}
