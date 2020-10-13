import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FILTER_MODES } from './todos/constants/filter-modes';

import { ITodo } from './todos/interfaces';
import { TodosService } from './todos/services/todos.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('todoForm') todoForm: NgForm;
  
  allTodos: ITodo[];
  completedTodos: ITodo[];
  mode: FILTER_MODES;
  subscription: Subscription;
  filterSubscription: Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private todosService: TodosService
  ) { }

  ngOnInit(): void {
    this.subscription = this.todosService.allTodos$.subscribe(todos => {
      this.allTodos = todos;
      this.completedTodos = todos.filter((todo) => todo.completed);
      this.changeDetectorRef.detectChanges();
    });
    this.filterSubscription = this.todosService.filterMode$.subscribe((mode) => {
      this.mode = mode;
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  addTodo() {
    if (this.todoForm.valid) {
      this.todosService.addTodo(this.todoForm.value.todo);
      this.todoForm.controls.todo.setValue('');
      this.changeDetectorRef.detectChanges();
    }
  }

  toggleMode(mode: FILTER_MODES) {
    this.todosService.changeFilterMode(mode);
  }

  clearCompleted() {
    this.todosService.clearCompleted();
  }
}
