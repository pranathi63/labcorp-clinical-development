import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FILTER_MODES } from '@app/todos/constants/filter-modes';
import { ITodo } from '@app/todos/interfaces';
import { TodosService } from '@app/todos/services/todos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todos-list',
  styleUrls: [
    './todo-list.component.scss',
  ],
  templateUrl: './todo-list.component.html',
})
export class TodosListComponent implements OnInit, OnDestroy {

  @ViewChild('todoInput') todoInput: any;

  allTodos: ITodo[];
  subscription: Subscription;
  filterSubscription: Subscription;
  editIndex: number;
  mode: FILTER_MODES;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private todosService: TodosService,
  ) { }

  ngOnInit(): void {
    this.allTodos = [];
    this.subscription = this.todosService.allTodos$.subscribe(todos => {
      this.allTodos = todos;
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

  toggleEdit(index: number) {
    this.editIndex = index;
    this.changeDetectorRef.detectChanges();
    this.todoInput.nativeElement.focus();
  }

  toggleComplete(index: number) {
    this.todosService.toggleComplete(index);
  }

  removeTodo(index: number) {
    this.todosService.removeTodo(index);
  }

  updateTodo(index: number, text: string) {
    this.todosService.updateTodo(index, text);
    this.editIndex = null;
  }

  displayTodo(todo: ITodo) {
    switch(this.mode) {
      case 'Completed': {
        return todo.completed;
      }
      case 'Active': {
        return !todo.completed;
      }
      default: {
        return true;
      }
    }
  }
}
