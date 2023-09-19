import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8080/api/v1';
  constructor(private http: HttpClient) { }


  getTasksByIdProjects(projectid: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getById-project?projectid=${projectid}`);
  }


  deletetaskbyid(taskid:number):Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-task-Base?taskid=${taskid}`)

  }

  createTask(title: string, description: string, status: string, projectId: number): Observable<any> {
    const params = {
      title: title,
      description: description,
      status: status,
      projectId: projectId
    };
  
    return this.http.post(`${this.baseUrl}/add-task`, null, { params: params });
  }

  getTaskbyId(taskid: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getTask-byid?taskid=${taskid}`);
  }

  updateTask(taskId: number, title: string, description: string, status: string, projectId: number): Observable<any> {
    const url = `${this.baseUrl}/put-Task?taskid=${taskId}&title=${title}&description=${description}&status=${status}&projectid=${projectId}`;
    
    return this.http.put(url, null);
  }
}
