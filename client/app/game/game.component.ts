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
    name: "Eddy",
    age: 9,
    time: 0,
    score: 50,
  };
  score: number = 0;
  questions: Question[] = [];
  gameQuestions: Question[] = [];
  questionMark: string = "";
  currentQuestion: Question;
  roundTopic: string = "";
  randomQuestionIndex: number = 0;
  gameOverCount: number = 1;

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
      if(this.gameOverCount == 1) {
        this.gameOverCount++;
        this.gameOver();
      }
    }
  }

  getData() {
    this.gottenData = this.inputDataService.getInputData();
  }

  createScore(scoreToCreate: any) {
    // this.scoreService.create(this.scoreData, true)
    this.scoreService.create(scoreToCreate, true)
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
        console.log("this.questions", this.questions);
        for(let i = 0; i < this.questions.length; i++) {
          console.log("this.questions[i]", this.questions[i]);
          console.log("this.questions[i].topic", this.questions[i].topic);
          console.log("topic == q.topic", this.roundTopic == this.questions[i].topic);
          if(this.roundTopic == this.questions[i].topic) {
            this.gameQuestions.push(this.questions[i]);
          }
        }
        console.log("gameQuestions", this.gameQuestions);

        /*
        for(let i = 0; i < this.questions.length; i++) {
          console.log("____________________________________________________________________________");
          console.log("this.questions", this.questions);
          console.log("this.questions.length", this.questions.length);
          console.log("this.questions[i]", this.questions[i]);
          console.log("this.questions[i].topic", this.questions[i].topic);
          console.log("this.questions[i].topic != this.roundTopic", this.questions[i].topic != this.roundTopic);
          if((this.questions[i].topic != this.roundTopic) && this.questions.length == 1) {
            console.log("Popped ---------------------------------------");
            this.questions.pop();
          } else if(this.questions[i].topic != this.roundTopic) {
            console.log("Spliced --------------------------------------");
            this.questions.splice(i,1);
          }
          console.log("end __________________________________________________________________________");
        }*/
        // console.log("questions in topic", questions);
        // this.currentQuestion = this.questions[this.randomQuestionIndex];
        this.currentQuestion = this.gameQuestions[this.randomQuestionIndex];
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
    // this.inputDataService.setGameData(this.gameData);
    this.createScore(this.gameData);
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
      console.log("questions.length", this.gameQuestions.length);
      if(this.gameQuestions.length == 1) {
        this.gameOver();
      }
      if(this.gameQuestions.length <= 0) {
        // this.gameOver();
        this.gameOver();
      } else {
        for(let j = 0; j < this.gameQuestions.length; j++) {
          if(this.currentQuestion.q == this.gameQuestions[j].q) {
            this.gameQuestions.splice(j,1);
          }
        }
      // else randomly get next question
        this.randomQuestionIndex = Math.floor(Math.random() * (this.gameQuestions.length - 1));
        this.currentQuestion = this.gameQuestions[this.randomQuestionIndex];
      }
    } else {
      this.alertService.error('Wrong', true);
      if(this.gameQuestions.length == 1) {
        this.gameOver();
      }
      if(this.gameQuestions.length <= 0) {
        // this.gameOver();
        this.gameOver();
      } else {
        for(let j = 0; j < this.gameQuestions.length; j++) {
          if(this.currentQuestion.q == this.gameQuestions[j].q) {
            this.gameQuestions.splice(j,1);
          }
        }
      // else randomly get next question
        this.randomQuestionIndex = Math.floor(Math.random() * (this.gameQuestions.length - 1));
        this.currentQuestion = this.gameQuestions[this.randomQuestionIndex];
      }
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
