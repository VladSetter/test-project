import { Routes } from '@angular/router';
import { AiAnalize2TextsPageComponent } from './ai-analize-2-texts-page.component';
import { AskAiPageComponent } from './ask-ai-page.component';
import { authGuard } from './auth.guard';
import { HealthPageComponent } from './health-page.component';
import { LoginPageComponent } from './login-page.component';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'health'
	},
	{
		path: 'health',
		component: HealthPageComponent,
		canActivate: [authGuard]
	},
	{
		path: 'ask-ai',
		component: AskAiPageComponent,
		canActivate: [authGuard]
	},
	{
		path: 'ai-analize-2-texts',
		component: AiAnalize2TextsPageComponent,
		canActivate: [authGuard]
	},
	{
		path: 'login',
		component: LoginPageComponent
	}
];
