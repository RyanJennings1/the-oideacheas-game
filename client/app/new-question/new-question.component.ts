import { Component, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Score } from '../_models/index';
import { AlertService, QuestionService } from '../_services/index';

@Component ({
  moduleId: module.id,
  templateUrl: 'new-question.component.html'
})

export class NewQuestionComponent {
  model: any = {};
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private questionService: QuestionService,
    public router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
        "q": "",
        "ans1": "",
        "ans2": "",
        "ans3": "",
        "ans4": "",
        "rightAnswer": "",
        "topic": "",
    });
  }

  submitFormData() {
      this.questionService.create(this.form.value, true)
        .subscribe(
            data => {
                this.alertService.success("Question created", true);
                console.log("data", data);
            },
            error => {
                console.log("error", error);
            }
        );
  }

}
