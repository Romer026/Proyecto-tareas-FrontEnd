import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { Router } from '@angular/router';
import  { Project } from "src/app/components/models/project";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  ProjectList: Project []=[];

  constructor( private projectService:ProjectService, private router:Router) { }

  ngOnInit(): void {
    this.getAllProjects();
  }


  getAllProjects(){
    this.projectService.getAllProjects().subscribe(data=>{
      this.ProjectList = data as any[];
      // console.log("imprimiendo la data de proyectos"+this.ProjectList);
      // console.log("Datos de proyectos:", JSON.stringify(this.ProjectList, null, 2));
      
    });
  }
}
