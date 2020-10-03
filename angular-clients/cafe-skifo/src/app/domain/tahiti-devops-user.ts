export class TahitiDevopsUser {
  sub: string;
  preferredUsername: string;
  roles: string[] = [];

  constructor(init?: Partial<TahitiDevopsUser>) {
    Object.assign(this, init);
  }

  isAuthenticated(): boolean {
    return !!this.sub;
  }

  isBarman(): boolean {
    return this.roles.includes('BARMAN');
  }

  static readonly ANONYMOUS = new TahitiDevopsUser({});
}
