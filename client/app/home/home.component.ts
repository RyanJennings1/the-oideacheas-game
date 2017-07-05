import { Component, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { InputDataService } from '../_services/index';

@Component ({
  moduleId: module.id,
  templateUrl: 'home.component.html'
})

export class HomeComponent {
  model: any = {};
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inputDataService: InputDataService,
    public router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      "name": "",
      "age": "",
    });
  }

  submitFormData() {
    console.log(this.form.value);
    this.inputDataService.setInputData(this.form.value);
    this.router.navigate(['/game']);
  }

}
