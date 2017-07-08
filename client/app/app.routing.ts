import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
import { GameComponent } from './game/index';
import { LeaderboardComponent } from './leaderboard/index';
import { NewQuestionComponent } from './new-question/index';
import { MyQuestionsComponent } from './myquestions/index';
import { MyScoresComponent } from './myscores/index';
import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'game', component: GameComponent },
    { path: 'leaderboard', component: LeaderboardComponent },
    { path: 'new-question', component: NewQuestionComponent },
    { path: 'myquestions', component: MyQuestionsComponent },
    { path: 'myscores', component: MyScoresComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
