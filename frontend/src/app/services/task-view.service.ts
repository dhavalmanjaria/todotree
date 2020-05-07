import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskViewService {

  recentTasksUrl = 'http://localhost:3000/api/getRecentTasks';

  constructor(private http: HttpClient) { }


  getRecentTasks(): Observable<any> {
      return this.http.get(this.recentTasksUrl);
  }
}
