import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  protected readonly username = signal('');
  protected readonly password = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  protected setUsername(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.username.set(target.value);
  }

  protected setPassword(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.password.set(target.value);
  }

  protected submit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.isSubmitting.set(true);

    this.loginService.login(this.username(), this.password()).subscribe((result) => {
      this.isSubmitting.set(false);

      if (!result.success) {
        this.errorMessage.set(result.message);
        return;
      }

      this.successMessage.set(result.message);
      this.password.set('');
      this.router.navigateByUrl('/health');
    });
  }
}
