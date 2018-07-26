import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {Category,Difficulty,Question,ClientAnswer} from '../data.interface';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {
   categories:Category[]=[];
   difficulties:Difficulty[]=[];
   questions:Question[]=[];
   selectCategory:number =0;
   selectDifficulty:number=0;
   nbQuestions:number=10;
   isQcmReceived:boolean=false; // QCM reçu ou pas
   indexQuestion:number =0;
   client_answers: ClientAnswer[]=[];
   btnVAlidDisabled:boolean=true;
  constructor(private dataService: DataService) { }

        ngOnInit()
         {

          this.dataService.getCategories().subscribe((res:Category[])=>{
            this.categories=res;
              });
          this.dataService.getDifficulies().subscribe((res:Difficulty[])=>{
            this.difficulties=res;
          });
         }

        submit()
          {
            let params:string=
             `?cat=${this.selectCategory}&dif=${this.selectDifficulty}&nbq=${this.nbQuestions}`;
              //console.log(params);
              // console.log(this.nbQuestions);
              // console.log(this.selectCategory);
              // console.log(this.selectDifficulty);
              this.dataService.getQuizz(params).subscribe((res: Question[])=>{
              //console.log(res);
              this.isQcmReceived = true;
              this.questions=res;
              });
          }

        validQuestion()
          {
            //console.log('ok');
            // envoi au serveur pour validation
            // passage à la question svt
            if (this.indexQuestion<this.questions.length-1) {
                this.indexQuestion++;
            }else{
               // fin du formulaire (derniére question)
               // envoi  des réponses au serveur pour avalidation
               this.sendAnswers();

                }
                 this.btnVAlidDisabled=true; // btn désactiver
          }

        makeChoice(choice,choice_list,choice_list_item)
          {

            //choice_list_item.style.color='red';
            // retrait de la classe selected sur l'élement précédemment sélectionné(nettoyage)
            //  console.log('test');
            let choices= choice_list.children; // enfants du ul => c'est sont li
            for (let i:number = 0; i <choices.length ; i++) {

                choices[i].classList.remove('selected');
            }
                //mise en forme de l'élément (choix) sélectionné
            choice_list_item.classList.add('selected');
            let qid = this.questions[this.indexQuestion].id;
            let aid=choice.id;
            let answer:ClientAnswer ={qid:qid, aid:aid};
            //    console.log('Question: '+qid+' => Choix '+aid);
            // 1/à chaque clic sur une réponse => deux possiblités
            // et dc une réponse a déjà fournie, du coup :on la remplace
            //2/l'id de la question n'existé pas , du coup: on l'ajoute
             if (this.client_answers.length==0) {
                 this.client_answers.push(answer);
             }
                      let qidx:number =this.isQcmReceivedTreated(answer.qid);
                      if (qidx == -1) {
                          console.log('question non traitée , pas de réponse associée ');
                          // Ajout de la question/réponse ds le tableau des réponse client
                          this.client_answers.push(answer);
                      } else{
                        console.log('Question déjà traitée mise à ajour de la réponse');
                         this.client_answers[qidx].aid=answer.aid;
                          }


                   // btnVAlidDisabled de avalidation est actif
                       this.btnVAlidDisabled=false;
                      console.log(this.client_answers);

                    }
                 // méthode déterminant si question a déjà une réponse
                 isQcmReceivedTreated(qid: number):number
                 {
                   for (let i:number = 0; i < this.client_answers.length; i++) {
                      if (this.client_answers[i].qid==qid) {
                          return i; // retourn la position de la question ds le tableau
                      }
                   }
                   return -1; // si l'id de la question n'a pas été trouvé on retourne -1
                 }

        sendAnswers()
          {
              console.log('envoie le réponse');
              // envoi des réponses au serveur via dataService
              this.dataService.postClientAnswers(this.client_answers).subscribe((res)=>{
              console.log(res);
            })

          }
      }
