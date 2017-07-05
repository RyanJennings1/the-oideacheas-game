import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { User, Score } from '../_models/index';

@Injectable()
export class ScoreService {
    createData = {
      score: {},
      flag: true,
    }
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        console.log("In getAll");
        return this.http.get(this.config.apiUrl + '/scores/', this.jwt()).map((response: Response) => response.json());
    }

    getById(_id: string) {
        return this.http.get(this.config.apiUrl + '/scores/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    create(score: Score, flag: boolean) {
        this.createData.score = score;
        this.createData.flag = flag;
        return this.http.post(this.config.apiUrl + '/scores/register', this.createData, this.jwt());
    }

    update(score: Score) {
        return this.http.put(this.config.apiUrl + '/scores/' + score._id, score, this.jwt());
    }

    delete(_id: string) {
        return this.http.delete(this.config.apiUrl + '/scores/' + _id, this.jwt());
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
