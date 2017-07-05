import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AppConfig } from './app.config';

import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, UserService, InputDataService, ScoreService, QuestionService } from './_services/index';
import { HomeComponent } from './home/index';
import { GameComponent } from './game/index';
import { LeaderboardComponent } from './leaderboard/index';
import { NewQuestionComponent } from './new-question/index';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        ChartsModule,
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        GameComponent,
        LeaderboardComponent,
        NewQuestionComponent,
    ],
    providers: [
        AppConfig,
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        InputDataService,
        ScoreService,
        QuestionService,
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
