import { Component, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Score } from '../_models/index';
import { InputDataService, ScoreService } from '../_services/index';

@Component ({
  moduleId: module.id,
  templateUrl: 'leaderboard.component.html'
})

export class LeaderboardComponent {
  model: any = {};
  form: FormGroup;
  gameData: any = {};
  scores: Score[] = [];

  constructor(
    private fb: FormBuilder,
    private inputDataService: InputDataService,
    private scoreService: ScoreService,
    public router: Router
  ) { this.loadAllScores(); }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.gameData = this.inputDataService.getGameData();
    console.log("this.gameData", this.gameData);
  }

  loadAllScores() {
    this.scoreService.getAll().subscribe(
      scores => {
        this.scores = scores;
        console.log("this.scores", this.scores);
        this.scores = this.scores.sort(function(a,b) {
          return a.score - b.score;
        });
        console.log("this.scores sorted", this.scores);
      },
      error => {
        console.log("error", error);
      }
    )
  }

}
