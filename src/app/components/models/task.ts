import { Project } from "./project";

export class Task {
    taskid: number;
    title: string;
    description: string;
    status: string;
    project: Project; // Aquí asumimos que tienes un modelo llamado Project para la relación
  }