import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './components/projects/projects.component';
import { TasksComponent } from './components/tasks/tasks.component';

const routes: Routes = [
  {path:'' ,redirectTo:'Projects',pathMatch:'full'},
  {path:'Projects', component: ProjectsComponent },
  {path:'Taskdetails/:projectid', component: TasksComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
