import { Component, OnInit } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { Task } from '../../classes/task';
import { TaskViewService } from '../../services/task-view.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  currentTask: Task
  parentTask = new Task();
  selectedTaskId = '';
  siblings = [];

  constructor(private taskServ: TaskViewService) { 
  }



  ngOnInit(): void {

      this.currentTask = new Task()
      this.currentTask.taskId = 'tid-1';
      this.currentTask.title = 'Current task';
      this.parentTask.taskId = 'tid-p';
      this.siblings = [
          (new Task('Child 1','','tid-c-1' )),
          (new Task('Child 2', '','tid-c-2'))
      ];

      this.taskServ.getRecentTasks().subscribe(res => {
          if (res) {
              this.currentTask = res['task'];
              this.siblings = res['siblings'];
              this.parentTask = res['parent'];
          } else {
              console.log("res is not defined");
          }
      });
  }

  onTaskSelected(task) {
      this.selectedTaskId = task.taskId;
      console.log(task.taskId);
  }

}
