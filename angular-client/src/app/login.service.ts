import { Injectable, inject } from '@angular/core';
import MD5 from 'crypto-js/md5';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface LoginResult {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly authService = inject(AuthService);
  private readonly credentialUsernameStorageKey = 'demo.usernameHash';
  private readonly credentialPasswordStorageKey = 'demo.passwordHash';
  private readonly allowedUsernameHash = '5e8edd851d2fdfbd7415232c67367cc3';
  private readonly allowedPasswordHash = 'b75fb6962574b8d26978c08fb6fc5715';

  login(username: string, password: string): Observable<LoginResult> {
    const normalizedUsername = username.trim();

    if (!normalizedUsername || !password) {
      return of({
        success: false,
        message: 'Username and password are required.'
      });
    }

    const inputUsernameHash = MD5(normalizedUsername).toString();
    const inputPasswordHash = MD5(password).toString();

    const isValidCredentials = this.isValidCredentialHashes(inputUsernameHash, inputPasswordHash);

    if (!isValidCredentials) {
      return of({
        success: false,
        message: 'Invalid username or password.'
      }).pipe(delay(300));
    }

    this.persistCredentialHashes(inputUsernameHash, inputPasswordHash);
    this.authService.login(normalizedUsername);

    return of({
      success: true,
      message: 'Login successful (demo page).'
    }).pipe(delay(300));
  }

  restoreSessionFromStorage(): void {
    const usernameHash = localStorage.getItem(this.credentialUsernameStorageKey);
    const passwordHash = localStorage.getItem(this.credentialPasswordStorageKey);

    if (!usernameHash || !passwordHash) {
      return;
    }
S
    if (!this.isValidCredentialHashes(usernameHash, passwordHash)) {
      localStorage.removeItem(this.credentialUsernameStorageKey);
      localStorage.removeItem(this.credentialPasswordStorageKey);
      return;
    }

    this.authService.login('developer');
  }

  private isValidCredentialHashes(usernameHash: string, passwordHash: string): boolean {
    return usernameHash === this.allowedUsernameHash && passwordHash === this.allowedPasswordHash;
  }

  private persistCredentialHashes(usernameHash: string, passwordHash: string): void {
    localStorage.setItem(this.credentialUsernameStorageKey, usernameHash);
    localStorage.setItem(this.credentialPasswordStorageKey, passwordHash);
  }
}
