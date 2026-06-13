import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AIProxyService } from './ai-proxy.service';
import { OllamaModelSelectComponent } from './ollama-model-select.component';

@Component({
  selector: 'app-ask-ai-page',
  standalone: true,
  imports: [OllamaModelSelectComponent],
  templateUrl: './ask-ai-page.component.html',
  styleUrl: './ask-ai-page.component.scss'
})
export class AskAiPageComponent {
  private readonly aiProxyService = inject(AIProxyService);

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

  protected setModel(model: string): void {
    this.model.set(model);
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

    this.aiProxyService
      .askAi({
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
