import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

interface AnalyzeTextsResponse {
  answer: string;
}

@Component({
  selector: 'app-ai-analize-2-texts-page',
  standalone: true,
  templateUrl: './ai-analize-2-texts-page.component.html',
  styleUrl: './ai-analize-2-texts-page.component.scss'
})
export class AiAnalize2TextsPageComponent {
  private readonly http = inject(HttpClient);

  protected readonly apiUrl = 'http://localhost:8080/api/private/ai-proxy/ask-compare';
  protected readonly systemMessage = signal('');
  protected readonly textOne = signal('');
  protected readonly textTwo = signal('');
  protected readonly model = signal('');
  protected readonly answer = signal('');
  protected readonly errorMessage = signal('');
  protected readonly state = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  protected setSystemMessage(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.systemMessage.set(target.value);
  }

  protected setTextOne(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.textOne.set(target.value);
  }

  protected setTextTwo(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.textTwo.set(target.value);
  }

  protected setModel(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.model.set(target.value);
  }

  protected submit(): void {
    const firstText = this.textOne().trim();
    const secondText = this.textTwo().trim();

    if (!firstText || !secondText) {
      this.state.set('error');
      this.errorMessage.set('Both text fields are required.');
      this.answer.set('');
      return;
    }

    this.state.set('loading');
    this.errorMessage.set('');

    this.http
      .post<AnalyzeTextsResponse>(this.apiUrl, {
        systemMessage: this.systemMessage().trim() || undefined,
        textOne: firstText,
        textTwo: secondText,
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
