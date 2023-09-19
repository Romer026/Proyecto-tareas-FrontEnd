import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { Task } from '../models/task';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
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
export class TasksComponent implements OnInit {
  taskList: Task[] = [];
  task: any = {};
  projectid: number;
  barraCarga = false;
  submitted = false;
  visible = false;
  isEditMode = false;


  taskStatusOptions = [
    { label: 'POR HACER', value: 'POR HACER' },
    { label: 'EN PROCESO', value: 'EN PROCESO' },
    { label: 'COMPLETADO', value: 'COMPLETADO' }
  ];

  constructor(private route: ActivatedRoute, private taskService: TaskService, private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.isEditMode=false;
    this.task={};
    this.route.params.subscribe(params => {
      this.projectid = +params['projectid'];
      console.log("recibiendo el parametro en tasks" + this.projectid);
      this.getTaskByIdProject(this.projectid);
      // Convierte el parámetro a número si es necesario
      // Ahora puedes usar this.projectid en tu componente
    });
  }

  showDialog() {
    this.visible = true;
    this.isEditMode = false;
    this.task = {};
  };
  onSubmitask() {
    this.submitted = true;
    this.isEditMode=false;
  }

  //metodo para crear el proyecto
  createTask() {
    this.barraCarga = true;
    this.confirmationService.confirm({
      header: 'Confirmación',
      rejectLabel: 'No',
      acceptLabel: 'Si',

      acceptButtonStyleClass: 'p-confirmdialog-acceptbutton p-button-outlined p-button-success p-button-text',
      rejectButtonStyleClass: 'p-confirmdialog-rejectbutton p-button-outlined p-button-danger p-button-text',
      message: '¿Esta seguro que desea guardar ésta tarea?',
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
          this.taskService.createTask(this.task.title, this.task.description, this.task.status, this.projectid).subscribe(
            data => {
              this.task = {};
              this.getTaskByIdProject(this.projectid);
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
  }
  getbyidtask(taskid:number){
    this.isEditMode = true;
    this.visible = true;
    this.taskService.getTaskbyId(taskid)
      .subscribe(
        data => {
          this.task = data as any;
          // this.getAllProjects();
        });

  }
  updateTask() {
    this.barraCarga=true;
    this.isEditMode = true;
    this.confirmationService.confirm({
      header: 'Confirmación',
      rejectLabel: 'No',
      acceptLabel: 'Si',

      acceptButtonStyleClass: 'p-confirmdialog-acceptbutton p-button-outlined p-button-success p-button-text',
      rejectButtonStyleClass: 'p-confirmdialog-rejectbutton p-button-outlined p-button-danger p-button-text',
      message: '¿Esta seguro que desea realizar cambios a esta tarea?',
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
          this.taskService.updateTask(this.task.taskid, this.task.title,this.task.description,this.task.status,this.projectid).subscribe(
            data => {

              this.task = {};
              this.getTaskByIdProject(this.projectid);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Tarea actualizada con exito'
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
  getTaskByIdProject(projectid: number) {
    this.barraCarga = true;
    this.taskService.getTasksByIdProjects(projectid).subscribe(
      (data: any) => {
        this.taskList = data.object;
        console.log(JSON.stringify(this.taskList) + " los datos de la tareas");

      },
      error => {
        console.error('Error al obtener las tareas:', error);
      }
    );
    this.barraCarga = false;
  }
  deleteTaskbyId(taskid: number) {
    this.barraCarga = true;
    this.confirmationService.confirm({
      header: 'Confirmación',
      rejectLabel: 'No',
      acceptLabel: 'Si',

      acceptButtonStyleClass: 'p-confirmdialog-acceptbutton p-button-outlined p-button-success p-button-text',
      rejectButtonStyleClass: 'p-confirmdialog-rejectbutton p-button-outlined p-button-danger p-button-text',
      message: '¿Esta seguro que desea eliminar esta tarea?',
      accept: () => {
        this.taskService.deletetaskbyid(taskid)
          .subscribe(
            data => {
              this.getTaskByIdProject(this.projectid);
              console.log(data);
              // this.get();
            },
            error => console.log(error));
        // this.getAllProjects();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tarea eliminada con exito'
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

  }

}
