import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = 'http://localhost:8080/api/v1';
  constructor(private http: HttpClient) { }


  getAllProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all`);
  }
  createProject(name: string, description: string): Observable<any> {
    // Construir la URL con los parámetros de consulta
    const url = `${this.baseUrl}/add-project?name=${name}&description=${description}`;

    return this.http.post(url, {});
  }


  getProjectbyId(projectid: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-byid?projectid=${projectid}`);
  }

  // createProject(project: Object): Observable<Object> {
  //   return this.http.post(`${this.baseUrl}/add-project/`, project);
  // }
  // createProject(projectData: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });
  //   const options = { headers: headers };
  //   return this.http.post(`${this.baseUrl}/add-project/`, JSON.stringify(projectData), options);
  // }

  // updateProject(id: number,value:any): Observable<Object> {
  //   return this.http.put(`${this.baseUrl}/put-project?projectid=${id}`, value);
    // updateProject(id: number, projectData: any): Observable<Object> {
    //   return this.http.put(`${this.baseUrl}/put-project/${id}`, projectData);
    // }
  // }
  updateProject(id: number, name: string, description: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    const options = { headers: headers, body: {} }; // Definir un cuerpo vacío
  
    return this.http.put(`${this.baseUrl}/put-project?projectid=${id}&name=${name}&description=${description}`, null, options);
  }

  deleteProject(projectid: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-project-base?projectid=${projectid}`);
  }
}
