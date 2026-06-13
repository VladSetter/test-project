import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';

interface HealthResponse {
  status: string;
  service: string;
}

@Component({
  selector: 'app-health-page',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './health-page.component.html',
  styleUrl: './health-page.component.scss'
})
export class HealthPageComponent implements OnInit {
  private readonly http = inject(HttpClient);

  protected readonly apiUrl = 'http://localhost:8080/health';
  protected readonly state = signal<'loading' | 'success' | 'error'>('loading');
  protected readonly response = signal<HealthResponse | null>(null);
  protected readonly errorMessage = signal<string>('');

  ngOnInit(): void {
    this.checkHealth();
  }

  protected checkHealth(): void {
    this.state.set('loading');
    this.errorMessage.set('');

    this.http.get<HealthResponse>(this.apiUrl).subscribe({
      next: (data) => {
        this.response.set(data);
        this.state.set('success');
      },
      error: (error: HttpErrorResponse) => {
        this.response.set(null);
        this.state.set('error');
        this.errorMessage.set(error.message || 'Failed to call health API');
      }
    });
  }
}
