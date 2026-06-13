import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface AskAiRequest {
  systemMessage?: string;
  prompt: string;
  model?: string;
}

export interface AskAiResponse {
  answer: string;
}

export interface AskCompareRequest {
  systemMessage: string;
  prefixTextOne: string;
  prefixTextTwo: string;
  textOne: string;
  textTwo: string;
  model: string;
}

export interface AskCompareResponse {
  answer: string;
}

export interface OllamaModelsResponse {
  models?: string[];
  defaultModel?: string;
}

@Injectable({ providedIn: 'root' })
export class AIProxyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/private/ai-proxy';

  readonly askAiUrl = `${this.baseUrl}/ask-ai`;
  readonly askCompareUrl = `${this.baseUrl}/ask-compare`;

  askAi(payload: AskAiRequest): Observable<AskAiResponse> {
    return this.http.post<AskAiResponse>(this.askAiUrl, payload);
  }

  askCompare(payload: AskCompareRequest): Observable<AskCompareResponse> {
    return this.http.post<AskCompareResponse>(this.askCompareUrl, payload);
  }

  listModels(): Observable<OllamaModelsResponse> {
    return this.http.get<OllamaModelsResponse>(`${this.baseUrl}/models`);
  }
}
