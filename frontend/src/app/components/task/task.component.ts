import { Component, OnInit } from '@angular/core';
import { Task } from '../../classes/task';
import { Input } from '@angular/core'


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input() task: Task;

  selectedTask: Task;

  constructor() { 
  }

  ngOnInit() {
      console.log(this.task);
  }

}
