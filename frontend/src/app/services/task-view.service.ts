import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TaskViewService {

  recentTasksUrl = 'http://localhost:3000/api/getRecentTasks';
  baseUrl = 'http://localhost:3000/api/';

  httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
  }

  constructor(private http: HttpClient) { }


  getRecentTasks(): Observable<any> {
      return this.http.get(this.recentTasksUrl);
  }

  getTask(taskId: String): Observable<any> {
      return this.http.get(this.baseUrl + `getTask/${taskId}`);
  }

  addChild(task: any): Observable<any> {
      var postData = {
          'title': task['title'],
          'description': task['description']
      }
      var newTaskUrl = `http://localhost:3000/api/${task['parentId']}/new`;
      return this.http.post(newTaskUrl, postData, this.httpOptions)
          .pipe(
              catchError(this.handleError('addChild', []))
           );
  }

  private handleError(op = 'operation', result?: any) {
      return (error: any): Observable<any> => {
          console.error(error);
          console.error(`${op} failed: ${error.message}`);
          return of(result);
      }
  }
}
