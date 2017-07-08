import { Component, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Score, Question } from '../_models/index';
import { AlertService, QuestionService, ScoreService } from '../_services/index';

@Component ({
  moduleId: module.id,
  templateUrl: 'myscores.component.html'
})

export class MyScoresComponent {
  model: any = {};
  form: FormGroup;
  scores: Score[] = [];

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private questionService: QuestionService,
    private scoreService: ScoreService,
    public router: Router
  ) {}

  ngOnInit() {
    this.getScores();
  }

  getScores() {
      this.scoreService.getAll()
        .subscribe(
            scores => {
                this.scores = scores;
                console.log("scores", scores);
            },
            error => {
                console.log("error", error);
            }
        );
  }

  deleteScore(_id: string) {
    this.scoreService.delete(_id).subscribe(
        data => {
            this.alertService.success("Score deleted", true);
        },
        error => {
            this.alertService.error(error._body);
        }
    );
  }

}
