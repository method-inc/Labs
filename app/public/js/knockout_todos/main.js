var id = 0;
var itemViewModel = function(options) {
  options = options || {};
  this.item = ko.observable(options.item || '');
  this.id = ko.observable(options.id || id++);
  this.hours = ko.observable(options.hours || '');
  this.enteredTime = ko.observable(options.enteredTime || 0);
  this.isDone = ko.observable(options.isDone || false);
  
  this.remove = function() {
    viewModel.tasks.remove(this);
  };

  this.inDanger = ko.dependentObservable(function() {
    return this.enteredTime() > this.hours();
  }, this);

  this.timeRemaining = ko.dependentObservable(function() {
    var hours = this.hours() - this.enteredTime();
    return (hours < 0) ? 0 : hours;
  }, this);

  var self = this;

  this.hours.subscribe(function() {
    amplify.store("skookum_tasks", viewModel.parseList(viewModel.tasks()));
  });

  this.item.subscribe(function() {
    amplify.store("skookum_tasks", viewModel.parseList(viewModel.tasks()));
  });

  this.enteredTime.subscribe(function() {
    amplify.store("skookum_tasks", viewModel.parseList(viewModel.tasks()));
  });

  this.isDone.subscribe(function() {
    console.log(viewModel.parseList(viewModel.tasks()));
    amplify.store("skookum_tasks", viewModel.parseList(viewModel.tasks()));
  });
};

var taskList = function() {
  
  var saved_tasks = amplify.store("skookum_tasks");

  this.tasks = ko.observableArray([]);
  this.itemToAdd = ko.observable("");
  this.addTime = ko.observable("");

  if (saved_tasks && saved_tasks.length) {
    console.log(saved_tasks);
    for(var i = 0; i < saved_tasks.length; i++) {
      this.tasks.push(new itemViewModel({
        item: saved_tasks[i].item,
        hours: saved_tasks[i].hours,
        enteredTime: saved_tasks[i].enteredTime,
        isDone: saved_tasks[i].isDone
      }));
    }
    window.setTimeout(function() {
      $('#todo-list').sortable({
        handle: '.handle',
        scroll:true,
        start: function(){
          $(this).data("startingScrollTop",$(this).parent().scrollTop());
        },
        drag: function(event,ui){
          var st = parseInt($(this).data("startingScrollTop"), 10);
          ui.position.top -= $(this).parent().scrollTop() - st;
        }
      });
    }, 100);
  }

  // get first item in list
  this.first = ko.dependentObservable(function() {
    return this.tasks()[0] || new itemViewModel();
  }, this);

  // get time remaining in all tasks
  this.time_remaining = ko.dependentObservable(function() {
    var total = 0;
    for(var i in this.tasks()) { 
      if (!this.tasks()[i].isDone()) total += this.tasks()[i].timeRemaining();
    }
    return total;
  }, this);
  
  var self = this;
  this.tasks.subscribe(function(tasks) {
    console.log("task changed");
    amplify.store("skookum_tasks", self.parseList(tasks));

    window.setTimeout(function() {
      $('#todo-list').sortable({
        handle: '.handle',
        scroll:true,
        start: function(){
          $(this).data("startingScrollTop",$(this).parent().scrollTop());
        },
        drag: function(event,ui){
          var st = parseInt($(this).data("startingScrollTop"), 10);
          ui.position.top -= $(this).parent().scrollTop() - st;
        }
      });
    }, 100);
  });

};

taskList.prototype = {
  onSort: function(ui, e) {
    var order = [];
    $('li', ui).each(function() {
      if($(this).attr('id')) order.push(parseInt($(this).attr('id'), 10));
    });
    var items = this.tasks();
    this.tasks( [] );
    for(var i in order) 
      for(var j in items)
        if(items[j].id() == order[i])
          this.tasks.push(items[j]);
    return true;
  },
  
  addItem: function() {
    if (this.itemToAdd()) {
      this.tasks.push(new itemViewModel({
        item: this.itemToAdd(),
        hours: parseInt(this.addTime(), 10) || 1
      }));
      this.itemToAdd("");
      this.addTime("");
    }
  },

  parseList: function(list) {
    var items = [];
    for(var l in list) {
      items.push({
        item: list[l].item(),
        id: list[l].id(),
        hours: list[l].hours(),
        enteredTime: list[l].enteredTime(),
        isDone: list[l].isDone()
      });
    }
    return items;
  }
};



// this.item = ko.observable(options.item || '');
//   this.id = ko.observable(id++);
//   this.hours = ko.observable(options.hours || '');
//   this.enteredTime = ko.observable(options.enteredTime || 0);
//   this.isDone = ko.observable(options.done || false);



viewModel = new taskList();

ko.applyBindings(viewModel);



$('input').keyup(function(e) {
  if(e.keyCode == 13) {
    $("#addItemButton").trigger("click");
  }
});

$("input[placeholder]").placeholder();