import { Component, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Score, Question } from '../_models/index';
import { AlertService, QuestionService } from '../_services/index';

@Component ({
  moduleId: module.id,
  templateUrl: 'myquestions.component.html'
})

export class MyQuestionsComponent {
  model: any = {};
  form: FormGroup;
  questions: Question[] = [];

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private questionService: QuestionService,
    public router: Router
  ) {}

  ngOnInit() {
    this.getQuestions();
  }

  getQuestions() {
      this.questionService.getAll()
        .subscribe(
            questions => {
                this.questions = questions;
                console.log("questions", questions);
            },
            error => {
                console.log("error", error);
            }
        );
  }

  deleteQuestion(_id: string) {
    this.questionService.delete(_id).subscribe(
        data => {
            this.alertService.success("Question deleted", true);
        },
        error => {
            this.alertService.error(error._body);
        }
    );
  }

}
