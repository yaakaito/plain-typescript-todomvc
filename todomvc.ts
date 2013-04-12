module TodoMVC {

  var proxy = function(func : Function, context : any) {
    return function() {
      func.apply(context, arguments);
    }
  };

  module Model {
    export class Base {
      save() : void {
        return ;
      }

      attributes() : Object {
        return null;
      }
    }

    export module Attributes {
      export interface Todo {
        title : string;
        completed : bool;
      }
    }

    export class Todo extends Base {
      private title : string    = 'untitled';
      private completed : bool  = false;

      constructor(title :string, completed : bool) {
        super();
        this.title = title;
        this.completed = completed;
      }

      toggle(force? : bool) : void {
        if (arguments.length == 1) { 
          this.completed = force;
        }
        else {
          this.completed = !this.completed;
        }
      }

      attributes() : Attributes.Todo {
        return {
          'title'     : this.title,
          'completed' : this.completed
        };
      }
    }
  }

  module Store {
    export class Base {

      private models : any[] = [];

      append(model : any) : void {
        this.models.push(model);
        console.log('pushed : ' + JSON.stringify(model.attributes()) );
      }

      length() : number {
        return this.models.length;
      }

      atIndex(index : number) : any {
        return this.models[index];
      }
    }

    export class Todo extends Base {

    }

    export var Todos : Todo = new Todo();
  }

  module Controller {
    
    export class Base {
      view     : View.Base = null;
      children : any[] = [];
      private parentView : View.Base = null;

      constructor {
        this.view = new View.Base();
      }

      init() : void {
        this.setup();
        for (var i = 0, l = this.children.length; i < l; i++) {
          this.children[i].init();
        }
      }
 
      display(parent? : View.Base) : void {
        if (arguments.length == 0) {
          this.view.renderWithRoot();
        }
        else {
          this.view.render(parent);
          this.parentView = parent;
        }

        for (var i = 0, l = this.children.length; i < l; i++) {
          this.children[i].display(this.view);
        }
      }

      render() : void {
        return ;
      }

      setup() : void {
        return ;
      }

      addListener(event : string, selector : string, callback : Function) : void {
        document.querySelector(selector).addEventListener(event, proxy(callback, this));
      }
    } 

    export class Header extends Base {

      newTodo : any = document.getElementById('new-todo');
      // fetch events
      listController : TodoList = null;
 
      setup() : void {
        // add events
        this.addListener('keyup', '#new-todo', this.addNewTodo);
      }

      addNewTodo(event) : void {
        var title = this.newTodo.value;
        if (event.which != 13 || title == '') {
          return ;
        }
        
        this.newTodo.value = '';
        var todo = new Model.Todo(title, false);
        Store.Todos.append(todo);

        this.listController.display();

      }
    }

    export class Footer extends Base {
      
      setup() : void {
        // add events
      }
    }

    export class TodoList extends Base {

      setup() : void {
        this.view = new View.TodoList();
      }
    }

    export class Root extends Base {

      constructor() {

        super()

        var header = new Header();
        var todoList = new TodoList();
        var footer = new Footer();

        header.listController = todoList;
      
        this.children = [header, todoList, footer];

      }
    }
  }

  module View {
    export class Base {

      childNode : any   = null;
      children  : any[] = [];
      root      : any   = null;

      renderWithRoot() : void {
        this.render(this.root);
      }

      render(parent : any) : void {
        return;
      }
    }

    export class Todo extends Base{

      todo : Model.Todo = null;

      render(parent : any) : void {
        var attrs = this.todo.attributes();
        var element = document.createElement('li');
        if (attrs.completed) {
          element.className = 'complete';
        }
        element.innerHTML = this.html(attrs.title, attrs.completed);
        parent.appendChild(element);
      }

      html(title : string, completed : bool) : string {
        var checked = completed ? 'checked' : '';

        var html = '<div class="view">';
        html    += '  <input class="toggle" type="checkbox" ' + checked + '>';
        html    += '  <label>' + title + '</label>';
        html    += '  <button class="destroy"></button>';
        html    += '</div>';
        html    += '<input class="edit" value="' + title + '">';

        return html;
      }
    }

    export class TodoList extends Base {

      root = document.getElementById('todo-list');

      render(parent : any) : void {
        this.root.innerHTML = '';
        var Todos = Store.Todos;
        for (var i = 0, l = Todos.length(); i < l; i++) {
          var todo = Todos.atIndex(i);
          var todoView = new Todo();
          todoView.todo = todo;
          todoView.render(this.root);
        }
      }
    }
  }

  export class Application {
    run() : void {
      var rootController = new Controller.Root();
      rootController.init();
      rootController.display();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  var application = new TodoMVC.Application();
  application.run();
});