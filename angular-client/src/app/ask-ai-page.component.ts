import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

interface AskAiResponse {
  answer: string;
}

@Component({
  selector: 'app-ask-ai-page',
  standalone: true,
  templateUrl: './ask-ai-page.component.html',
  styleUrl: './ask-ai-page.component.scss'
})
export class AskAiPageComponent {
  private readonly http = inject(HttpClient);

  protected readonly apiUrl = 'http://localhost:8080/api/private/ai-proxy/ask-ai';
  protected readonly systemMessage = signal('');
  protected readonly prompt = signal('');
  protected readonly model = signal('');
  protected readonly answer = signal('');
  protected readonly errorMessage = signal('');
  protected readonly state = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  protected setSystemMessage(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.systemMessage.set(target.value);
  }

  protected setPrompt(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.prompt.set(target.value);
  }

  protected setModel(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.model.set(target.value);
  }

  protected submit(): void {
    const trimmedPrompt = this.prompt().trim();

    if (!trimmedPrompt) {
      this.state.set('error');
      this.errorMessage.set('Prompt is required.');
      this.answer.set('');
      return;
    }

    this.state.set('loading');
    this.errorMessage.set('');

    this.http
      .post<AskAiResponse>(this.apiUrl, {
        systemMessage: this.systemMessage().trim() || undefined,
        prompt: trimmedPrompt,
        model: this.model().trim() || undefined
      })
      .subscribe({
        next: (data) => {
          this.answer.set(data.answer || 'No answer returned.');
          this.state.set('success');
        },
        error: (error: HttpErrorResponse) => {
          this.answer.set('');
          this.state.set('error');
          this.errorMessage.set(error.error?.error || error.message || 'Request failed.');
        }
      });
  }
}
