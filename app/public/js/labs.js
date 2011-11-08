$('#background-container img').plaxify();
$.plax.enable();

// Projects browser viewmodel
function ProjectsVM() {
  // Projects array
  this.projects = ko.observableArray([]);
  
  this.featured_projects = ko.dependentObservable(function() {
    return _.filter(this.projects(), function(p) { return p.featured(); });
  }, this);
  this.nonfeatured_projects = ko.dependentObservable(function() {
    return _.select(this.projects(), function(p) { return !p.featured(); });
  }, this);
  
  // Get the tags from each project and merge them into one array
  this.tags = ko.dependentObservable(function() {
    var self = this;
    return _(this.projects()).chain().
      map(function(p) { return p.tags(); }).
      flatten().
      uniq(false, function(t) { return t.name(); }).
      value();
  }, this);
  
  this.selectedTags = ko.observableArray([]);
  
  this.viewingAll = ko.dependentObservable(function() {
    return this.selectedTags().length == 0;
  }, this);
  
  this.projectsEmpty = ko.dependentObservable(function() {
    return _.all(this.projects(), function(p) {
      return !p.visible();
    });
  }, this);
}

ProjectsVM.prototype = {
  load: function(json) {
    var self = this;
    this.projects(_.map(json, function(p) {
      return new ProjectModel(p, self);
    }));
  },
  
  toggleTag: function(tag) {
    if(_.any(this.selectedTags(), function(t) {return tag.name() === t.name();})) {
      this.selectedTags.remove(function(t) {
        return t.name() === tag.name();
      });
    }
    else {
      this.selectedTags.push(_.detect( this.tags(), function(t) { return t.name() === tag.name(); } ));
    }
  },
  clearTags: function() {
    this.selectedTags([]);
  }
}


function ProjectModel(data, parent) {
  this.parent = parent;
  
  this.name = ko.observable(data.name);
  this.featured = ko.observable(data.featured);
  this.description = ko.observable(data.description);
  this.link = ko.observable(data.link);
  this.screenshot = ko.observable('/images/screenshots/' + data.screenshot);
  this.tags = ko.observableArray(_.map(data.tags, function(t) {
    return new TagModel(t, parent);
  }));
  
  this.visible = ko.dependentObservable(function() {
    var self = this;
    return _.all(this.parent.selectedTags(), function(tag) {
      return self.hasTag(tag);
    });
  }, this);
  
  var self = this;
  this.hasTag = function(tag) {
    return _.any(self.tags(), function( t ) {
    	return t.name() === tag.name();
    });
  }
}

function TagModel(name, parent) {
  this.name = ko.observable(name);
  var self = this;
  this.selected = ko.dependentObservable(function() {
    return _.any(parent.selectedTags(), function(t) {
      return t.name() === self.name();
    });
  }, this);
  this.toggle = function() {
    parent.toggleTag(self);
  }
}