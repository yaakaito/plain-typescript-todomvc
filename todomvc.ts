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

      attributes() : Object {
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
    }

    export class Todo extends Base {

    }

    export var Todos : Todo = new Todo();
  }

  module Controller {
    
    export class Base {
      children : any[] = [];

      display() : void {
        
        this.setup();
        this.render();

        for (var i = 0, l = this.children.length; i < l; i++) {
          this.children[i].display();
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
      }
    }

    export class Footer extends Base {
      
      setup() : void {
        // add events
      }
    }

    export class TodoList extends Base {

      setup() : void {
        // load from local storage
        // add events
      }
    }

    export class Root extends Base {

      constructor() {
        super()

        var header = new Header();
        var todoList = new TodoList();
        var footer = new Footer();
      
        this.children = [header, todoList, footer];

      }
    }
  }

  export class Application {
    run() : void {
      var rootController = new Controller.Root();
      rootController.display()
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  var application = new TodoMVC.Application();
  application.run();
});