import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from "src/app/components/models/project";
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  providers: [DialogService, ConfirmationService, MessageService],
  animations: [
    trigger('animation', [
      state('visible', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('void => *', [
        style({ transform: 'translateX(50%)', opacity: 0 }),
        animate('300ms ease-out')
      ]),
      transition('* => void', [
        animate(('250ms ease-in'), style({
          height: 0,
          opacity: 0,
          transform: 'translateX(50%)'
        }))
      ])
    ])
  ]
})

export class ProjectsComponent implements OnInit {

  ProjectList: Project[] = [];
  project: any = {};
  task:any ={};
  barraCarga = false;
  submitted = false;
  visible = false;
  visibletask=false;
  isEditMode = false;
  filtroNombre: string = '';
  originalProjectList: any;

  selectedProjectId: any;

  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router, private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService, private taskService:TaskService
  ) { }

  ngOnInit() {

    this.getAllProjects();
  }

  taskStatusOptions = [
    { label: 'POR HACER', value: 'POR HACER' },
    { label: 'EN PROCESO', value: 'EN PROCESO' },
    { label: 'COMPLETADO', value: 'COMPLETADO' }
  ];


  // extraer todos los proyectos y listar
  getAllProjects() {
    this.barraCarga = true;
    this.projectService.getAllProjects().subscribe((data: any) => {
      this.ProjectList = data;
      this.originalProjectList = data;
    },
      error => {
        console.error('Error al obtener los proyectos:', error);
      }

    )
    this.barraCarga = false;
  }
  onSubmit() {
    this.submitted = true;
  }
  onSubmitask(){
   this.submitted=true;
  }

  //metodo para crear el proyecto
  createProject() {
    this.barraCarga = true;
    this.confirmationService.confirm({
      header: 'Confirmación',
      rejectLabel: 'No',
      acceptLabel: 'Si',

      acceptButtonStyleClass: 'p-confirmdialog-acceptbutton p-button-outlined p-button-success p-button-text',
      rejectButtonStyleClass: 'p-confirmdialog-rejectbutton p-button-outlined p-button-danger p-button-text',
      message: '¿Esta seguro que desea guardar este Proyecto?',
      accept: () => {
        if (this.project.name === '' || this.project.description === '' || this.project.name === undefined || this.project.description === undefined) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Aviso',
            detail: 'Debe completar todos los campos'
          });
          this.barraCarga = false;
        } else {
          // console.log("mostrando la data generada"+  this.project.name + this.project.description);
          this.projectService.createProject(this.project.name, this.project.description).subscribe(
            data => {

              this.project = {};
              this.getAllProjects();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Proyecto guardado con exito'
              });
              this.barraCarga = false;
            });
          this.barraCarga = false;
        }
      }, reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'warn',
              detail: 'Operación cancelada'
            });
            this.barraCarga = false;
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', detail: 'Ventana Cerrada' });
            this.barraCarga = false;
            break;
        }
      }
    });
  }
  createTask(){
    // const projectInfo = this.selectedProjectId;

    this.barraCarga = true;
    this.confirmationService.confirm({
      header: 'Confirmación',
      rejectLabel: 'No',
      acceptLabel: 'Si',

      acceptButtonStyleClass: 'p-confirmdialog-acceptbutton p-button-outlined p-button-success p-button-text',
      rejectButtonStyleClass: 'p-confirmdialog-rejectbutton p-button-outlined p-button-danger p-button-text',
      message: '¿Esta seguro que desea asignar la tarea '+this.task.title +', al proyecto' +JSON.stringify(this.selectedProjectId.name)+'',
      accept: () => {
        if (this.task.title === '' || this.task.description === '' || this.task.status === '' || this.task.title === undefined || this.task.description === undefined || this.task.status === undefined) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Aviso',
            detail: 'Debe completar todos los campos'
          });
          this.barraCarga = false;
        } else {
          // console.log("mostrando la data generada"+  this.project.name + this.project.description);
          this.taskService.createTask(this.task.title, this.task.description, this.task.status,this.selectedProjectId.projectid).subscribe(
            data => {
              this.task = {};
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Tarea guardada con exito'
              });
              this.barraCarga = false;
              this.visible=false;
            });
          this.barraCarga = false;
        }
      }, reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'warn',
              detail: 'Operación cancelada'
            });
            this.barraCarga = false;
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', detail: 'Ventana Cerrada' });
            this.barraCarga = false;
            break;
        }
      }
    });

  };
  showDialog() {
    this.visible = true;
    this.isEditMode = false;
    this.project = {};
  };
  showDialogTask(){
    this.visibletask=true;
    this.selectedProjectId={};

  }

  //metodo para eliminar el proyecto
  deleteProject(id: any) {
    this.barraCarga = true

    this.confirmationService.confirm({
      header: 'Confirmación',
      rejectLabel: 'No',
      acceptLabel: 'Si',

      acceptButtonStyleClass: 'p-confirmdialog-acceptbutton p-button-outlined p-button-success p-button-text',
      rejectButtonStyleClass: 'p-confirmdialog-rejectbutton p-button-outlined p-button-danger p-button-text',
      message: '¿Esta seguro que desea eliminar este Proyecto?',
      accept: () => {
        this.projectService.deleteProject(id)
          .subscribe(
            data => {
              console.log(data);
              this.getAllProjects();
            },
            error => console.log(error));
        this.getAllProjects();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Proyecto eliminado con exito'
        });
        this.barraCarga = false;
      }, reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'warn',
              detail: 'Operación cancelada'
            });
            this.barraCarga = false;
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', detail: 'Ventana Cerrada' });
            this.barraCarga = false;
            break;
        }
      }
    });
  };

  getProjectById(projectid: number) {
    this.visible = true;
    this.isEditMode = true;
    this.projectService.getProjectbyId(projectid)
      .subscribe(
        data => {
          this.project = data as any;
          // this.getAllProjects();
        });
  }

  getTasklistFromidProject(projectid: number) {
    console.log("imprimiendo el parametro de la id" + projectid);
    this.barraCarga=true;
    this.router.navigate(['Taskdetails/' + projectid]);
    this.route.params.subscribe(params => {
      projectid = +params['projectid']; // Convierte el parámetro a número si es necesario
      // Ahora puedes usar this.projectid en tu componente
    });
    this.barraCarga=false;
  }

  filtrarProyectosPorNombre(nombre: string) {
    this.barraCarga=true;
    this.ProjectList = this.originalProjectList.filter((project: { name: string; }) =>
      project.name.toLowerCase().includes(nombre.toLowerCase())
    );
    this.barraCarga=false;
  }
  updateProject() {
    this.isEditMode = true;
    this.confirmationService.confirm({
      header: 'Confirmación',
      rejectLabel: 'No',
      acceptLabel: 'Si',

      acceptButtonStyleClass: 'p-confirmdialog-acceptbutton p-button-outlined p-button-success p-button-text',
      rejectButtonStyleClass: 'p-confirmdialog-rejectbutton p-button-outlined p-button-danger p-button-text',
      message: '¿Esta seguro que desea realizar cambios a este Proyecto?',
      accept: () => {
        if (this.project.name === '' || this.project.description === '' || this.project.name === undefined || this.project.description === undefined) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Aviso',
            detail: 'Debe completar todos los campos'
          });
          this.barraCarga = false;
        } else {
          // console.log("mostrando la data generada"+  this.project.name + this.project.description);
          this.projectService.updateProject(this.project.projectid, this.project.name, this.project.description).subscribe(
            data => {

              this.project = {};
              this.getAllProjects();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Proyecto actualizado con exito'
              });
              this.barraCarga = false;
            });
          this.barraCarga = false;
        }
      }, reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'warn',
              detail: 'Operación cancelada'
            });
            this.barraCarga = false;
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', detail: 'Ventana Cerrada' });
            this.barraCarga = false;
            break;
        }
      }
    });

  }
}
