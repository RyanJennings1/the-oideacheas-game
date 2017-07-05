import { Component, NgModule } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Question } from '../_models/index';
import { AlertService, InputDataService, QuestionService, ScoreService } from '../_services/index';

@Component ({
  moduleId: module.id,
  templateUrl: 'game.component.html'
})

export class GameComponent {
  model: any = {};
  form: FormGroup;
  gameData: any = {};
  scoreData: any = {
    name: "Jeff",
    age: 20,
    time: 0,
    score: 100,
  };
  score: number = 100;
  questions: Question[] = [];
  questionMark: string = "";
  currentQuestion: Question;
  roundTopic: string = "technology";
  randomQuestionIndex: number = 0;

  // Variable for Timer
  gottenData: any = {};
  ticks: number = 0;
  gameLengthMinutes: number = 2;
  minutesElapsed: number = 0;
  secondsElapsed: number = 0;
  minutesShown: number = this.gameLengthMinutes;
  secondsShown: number = 0;
  offsetNumber: string = "0";
  gameTimeLeft: number;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private inputDataService: InputDataService,
    private questionService: QuestionService,
    private scoreService: ScoreService,
    public router: Router
  ) {
    this.selectTopic();
    this.getQuestions();
  }

  ngOnInit() {
    this.getData();
    this.currentQuestion = this.questions[0];

    this.form = this.fb.group({
      "selectedAnswer": "",
    });

    let timer = Observable.timer(2000,1000);
    timer.subscribe(t=> {
      this.gameTimer(t);
    });
  }

  gameTimer(t: number) {
    if(t <= (this.gameLengthMinutes*60)) {
      this.ticks = t;
      this.secondsElapsed++;
      if(this.secondsElapsed > 50) {
        this.offsetNumber = "0";
      } else {
        this.offsetNumber = "";
      }
      if(this.secondsElapsed == 61) {
        this.secondsElapsed = 0;
        this.minutesElapsed++;
      }
      this.minutesShown = (this.gameLengthMinutes - this.minutesElapsed)-1;
      if(this.secondsElapsed == 0) {
        this.secondsShown = 0;
      } else {
        this.secondsShown = 60 - this.secondsElapsed;
      }
    } else {
      // console.log("Game Over");
      // this.gameOver();
    }
  }

  getData() {
    this.gottenData = this.inputDataService.getInputData();
  }

  createScore() {
    this.scoreService.create(this.scoreData, true)
      .subscribe(
        data => {
          console.log("data", data);
        },
        error => {
          console.log("error", error);
        }
      )
  }

  getQuestions() {
    let that = this;
    this.questionService.getAll().subscribe(
      questions => {
        // console.log("questions", questions);
        this.questions = questions;
        /*for(let i = 0; i < this.questions.length; i++) {
          /*if((this.questions[i].topic != this.roundTopic) && this.questions.length == 1) {
            this.questions.pop();
          } else /if(this.questions[i].topic != this.roundTopic) {
            this.questions.splice(i,1);
          }
        }*/
        // console.log("questions in topic", questions);
        this.currentQuestion = this.questions[this.randomQuestionIndex];
        if(this.currentQuestion.q.slice(-1) != '?') { this.questionMark = '?';}
      },
      error => {
        console.log("error", error);
      }
    )
  }

  gameOver() {
    this.gameData.name = this.gottenData.name;
    this.gameData.age = this.gottenData.age;
    this.gameData.score = this.score;
    this.gameData.time = (this.gameLengthMinutes*60)-this.ticks;
    this.inputDataService.setGameData(this.gameData);
    this.router.navigate(['/leaderboard']);
  }

  nextQuestion() {
    this.score += 5;
  }

  submitFormData() {
    if(this.form.value.selectedAnswer == this.currentQuestion.rightAnswer) {
      this.alertService.success('Correct', true);
      this.score += 5;
      // If array empty then end game
      if(this.questions.length <= 0) {
        // this.gameOver();
      } else {
        for(let j = 0; j < this.questions.length; j++) {
          if(this.currentQuestion.q == this.questions[j].q) {
            this.questions.splice(j,1);
          }
        }
      // else randomly get next question
        this.randomQuestionIndex = Math.floor(Math.random() * (this.questions.length - 1));
        console.log("randomQuestionIndex", this.randomQuestionIndex);
        console.log("questions.length", this.questions.length);
        this.currentQuestion = this.questions[this.randomQuestionIndex];
        console.log("currentQuestion", this.currentQuestion);
        console.log("questions", this.questions);
      }
    } else {
      this.alertService.error('Wrong', true);
    }
  }

  selectTopic() {
    let topicNumber = Math.floor(Math.random() * 3) + 1;
    switch(topicNumber) {
      case 1:
        this.roundTopic = "technology";
        break;
      case 2:
        this.roundTopic = "science";
        break;
      case 3:
        this.roundTopic = "geography";
        break;
      default:
        this.roundTopic = "technology";
        break;
    }
    console.log("roundTopic", this.roundTopic);
  }

}