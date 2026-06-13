import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loggedInState = signal(false);
  private readonly usernameState = signal('');

  readonly isLoggedIn = this.loggedInState.asReadonly();
  readonly username = this.usernameState.asReadonly();

  login(username: string): void {
    const normalizedUsername = username.trim();
    this.loggedInState.set(true);
    this.usernameState.set(normalizedUsername);
  }

  logout(): void {
    this.loggedInState.set(false);
    this.usernameState.set('');
  }
}
