import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { User, Question } from '../_models/index';

@Injectable()
export class QuestionService {
    createData = {
      question: {},
      flag: false,
    }
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/questions', this.jwt()).map((response: Response) => response.json());
    }

    getById(_id: string) {
        return this.http.get(this.config.apiUrl + '/questions/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    create(question: Question, flag: boolean) {
        this.createData.question = question;
        this.createData.flag = flag;
        return this.http.post(this.config.apiUrl + '/questions/register', this.createData, this.jwt());
    }

    update(question: Question) {
        return this.http.put(this.config.apiUrl + '/questions/' + question._id, question, this.jwt());
    }

    delete(_id: string) {
        return this.http.delete(this.config.apiUrl + '/questions/' + _id, this.jwt());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}
