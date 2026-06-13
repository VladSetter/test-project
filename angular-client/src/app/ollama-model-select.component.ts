import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { AIProxyService, OllamaModelsResponse } from './ai-proxy.service';

@Component({
  selector: 'app-ollama-model-select',
  standalone: true,
  templateUrl: './ollama-model-select.component.html',
  styleUrl: './ollama-model-select.component.scss'
})
export class OllamaModelSelectComponent implements OnInit {
  private readonly aiProxyService = inject(AIProxyService);

  @Input() id = 'ollama-model';
  @Input() label = 'Model (optional)';
  @Input() value = '';
  @Output() readonly valueChange = new EventEmitter<string>();

  protected readonly models = signal<string[]>([]);
  protected readonly defaultModel = signal<string>('');
  protected readonly state = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  protected readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadModels();
  }

  protected onModelChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.valueChange.emit(target.value);
  }

  protected refreshModels(): void {
    this.loadModels();
  }

  private loadModels(): void {
    this.state.set('loading');
    this.errorMessage.set('');

    this.aiProxyService.listModels().subscribe({
      next: (response) => {
        const availableModels = Array.isArray(response.models)
          ? response.models.filter((model) => typeof model === 'string' && model.trim().length > 0)
          : [];

        this.models.set(availableModels);
        this.defaultModel.set(response.defaultModel?.trim() || '');
        this.state.set('success');
      },
      error: (error: HttpErrorResponse) => {
        this.models.set([]);
        this.defaultModel.set('');
        this.state.set('error');
        this.errorMessage.set(error.error?.error || error.message || 'Unable to load models.');
      }
    });
  }
}
