import { Component, OnInit } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { Task } from '../../classes/task';
import { TaskViewService } from '../../services/task-view.service';
import { FormControl } from '@angular/forms';


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

  title = new FormControl('');
  description = new FormControl('');

  constructor(private taskServ: TaskViewService) { 
  }

  ngOnInit(): void {

      this.currentTask = new Task()
      this.getRecentTasks();
    
  }

  getRecentTasks() {
      this.taskServ.getRecentTasks().subscribe(res => {
          if (res) {
              this.currentTask = res['task'];
              this.siblings = res['siblings'];
              this.parentTask = res['parent'];
              this.selectedTaskId = this.currentTask.taskId;
          } else {
              console.log("res is not defined");
          }
      });
  }

  getTask(taskId: String) {
      this.taskServ.getTask(taskId).subscribe(res => {
          if (res) {
              this.currentTask = res['task'];
              this.siblings = res['siblings'];
              this.parentTask = res['parent'];
              this.selectedTaskId = this.currentTask.taskId;
          } else {
              console.log("res is not defined");
          }
      });
  }

  onTaskSelected(task) {
      this.selectedTaskId = task.taskId;
      console.log(task.taskId);
  }


  onSubmit() {
    var parentId = this.selectedTaskId;
    if (this.selectedTaskId == '') {
      parentId = this.currentTask.taskId;
    }

    this.taskServ.addChild({
        'title': this.title.value,
        'description': this.description.value,
        'parentId': this.selectedTaskId
      }
    ).subscribe((res) => {
      console.log(res);
      this.getRecentTasks();
    })
  }
}
