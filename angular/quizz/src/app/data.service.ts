import { Injectable } from '@angular/core';
import { HttpClient }from '@angular/common/http';
import { ClientAnswer } from './data.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private api:string='http://localhost:8000/api';
 // injection de service Http afin de réaliser des requétes  Ajax
  constructor(private http:HttpClient) { }
   test()   {
    console.log('test depuis DataService');
    //get renvoie un objet de type Observable(Rxjs)
     return this.http.get(this.api);
    // .subscribe((res)=>{
    //   console.log(res);
    //       return res;
    // });
    //on ne souscrit pas au Niveau du service

  }
  getCategories()
  {
      //get renvoie un objet de type Observable(Rxjs)
        //on ne souscrit pas au Niveau du service
      return this.http.get(this.api+'/category');
  }
  getDifficulies()
  {
      return this.http.get(this.api+'/difficulty');
  }
  getQuizz(params: string)
  {
    return this.http.get(this.api+'/quizz'+params);
  }
  postClientAnswers(client_answers:ClientAnswer[])
  {
      return this.http.post(this.api+'/quizz/answers',{answers:client_answers});
  }
}
