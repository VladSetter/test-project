import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { AIProxyService } from './ai-proxy.service';
import { OllamaModelSelectComponent } from './ollama-model-select.component';

@Component({
  selector: 'app-ai-analize-2-texts-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    OllamaModelSelectComponent,
    FormsModule
  ],
  templateUrl: './ai-analize-2-texts-page.component.html',
  styleUrl: './ai-analize-2-texts-page.component.scss'
})
export class AiAnalize2TextsPageComponent {
  private readonly aiProxyService = inject(AIProxyService);

  protected readonly systemMessage = signal('');
  protected readonly textOne = signal('');
  protected readonly textTwo = signal('');
  protected readonly model = signal('');
  protected readonly answer = signal('');
  protected readonly errorMessage = signal('');
  protected readonly state = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  prefixText1 = '';
  prefixText2 = '';

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

  protected setModel(model: string): void {
    this.model.set(model);
  }

  protected submit(): void {
    const systemMessage = this.systemMessage().trim();
    const prefixTextOne = this.prefixText1.trim();
    const prefixTextTwo = this.prefixText2.trim();
    const textOne = this.textOne().trim();
    const textTwo = this.textTwo().trim();
    const model = this.model().trim();

    if (!systemMessage || !prefixTextOne || !prefixTextTwo || !textOne || !textTwo || !model) {
      this.state.set('error');
      this.errorMessage.set('All fields are required before sending.');
      this.answer.set('');
      return;
    }

    this.state.set('loading');
    this.errorMessage.set('');

    this.aiProxyService
      .askCompare({
        systemMessage,
        prefixTextOne,
        prefixTextTwo,
        textOne,
        textTwo,
        model
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
