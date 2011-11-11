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
  }, this).extend({ throttle: 100 });
  
  this.selectedTags = ko.observableArray([]);
  
  this.viewingAll = ko.dependentObservable(function() {
    return this.selectedTags().length == 0;
  }, this).extend({ throttle: 100 });
  
  this.projectsEmpty = ko.dependentObservable(function() {
    return _.all(this.projects(), function(p) {
      return !p.visible();
    });
  }, this).extend({ throttle: 100 });
  
  this.selectedProject = ko.observable(new ProjectModel({}, this));
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
  },
  showModal: function(proj, element) {
    var width = 500,
        height = 500,
        e = $(element),
        p = $('#projects-modal'),
        i = e.children('img');
    $('#projects-modal').show();
    var image_offset = i.offset();
    var parent_offset = p.offsetParent().offset();
    $('#projects-modal').hide();
    var modal_beginning_position = { left: (image_offset.left - parent_offset.left) + 'px',  
            top: (image_offset.top - parent_offset.top) + 'px', 
            width: i.outerWidth(), 
            height: i.outerHeight() };
    p.css(modal_beginning_position);
    this.selectedProject(proj);
    
    _.delay(function() {
      $('#projects-modal').show();
      var position = {left: ($(window).width() - width) / 2, top: 100, width: width, height: height};
      var imgOffset = i.offsetParent().offset();
      var image_position = _.clone(position);
      image_position.left = (position.left - imgOffset.left + parent_offset.left);
      image_position.top = (position.top - imgOffset.top + parent_offset.top);
      p.addClass('shown');
      p.css(position);
      e.closest('li').addClass('project-modal');
      i.css(image_position);
      $('#projects-modal-overlay').fadeIn().click(close_modal);
    }, 250);
    
    var close_modal = function() {
      $('#projects-modal').css({'-webkit-transform': 'rotateY(180deg)'}).css(modal_beginning_position);
      e.closest('li').removeClass('project-modal');
      i.css({left: '', top: '', width: '', height: ''});
      $('#projects-modal-overlay').fadeOut();
      _.delay(function() {
        $('#projects-modal').hide().removeClass('shown').css({'-webkit-transform': ''});
      }, 1000);
    }
  }
}

var projectCounter = 0;
function ProjectModel(data, parent) {
  this.parent = parent;
  
  this.id = ko.observable("projectThumbnail" + (++projectCounter));
  this.name = ko.observable(data.name || "");
  this.featured = ko.observable(data.featured || "");
  this.description = ko.observable(data.description | "");
  this.link = ko.observable(data.link || "");
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
  
  this.showModal = function(e) {
    self.parent.showModal(self, e.currentTarget);
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


// KO Binding to "morph" one element into another, fading it and changing its height to match
// the new element. Use the "show" option to specify if the element should be shown. 
// Pass a selector as the "connected" option to specify which element it should fade in to. 
// This function will try to intelligently figure out which of the connected elements is 
// the old element.
ko.bindingHandlers.morph = {
  _initializing: true,
  init: function (element, valueAccessor) {
    // don't do the animation when the bindings are being set up
    window.setTimeout(function() {ko.bindingHandlers.morph._initializing = false;}, 500);
    // Initially set the element to be instantly visible/hidden depending on the value
    var value = valueAccessor();
    $(element).toggle(ko.utils.unwrapObservable(value.show) == true); // Use "unwrapObservable" so we can handle values that may or may not be observable
  },
  update: function (element, valueAccessor) {
    // don't do the animation on page load
    if(!ko.bindingHandlers.morph._initializing) {
      // Get the connected element, in the case where there is more than one possibility
      function getConnected(selector) {
        if(selector.search(/[a-zA-Z]/) == 0) selector = "#" + selector;
        var connected = $(selector);
        if( connected.length == 1 )
          return connected;
        else if(connected.length > 1) {
          var found = null;
          // find the element that's not hidden (and not this element)
          connected.each(function() {
            if($(this).css('display') == '' || $(this).css('display') == 'block' && this != element) {
              found = $(this);
              return false;
            }
          });
          if(found) return found;
          else return $('<div></div>');
        }
        else return $('<div></div>');
      }
      
      var value = valueAccessor(),
          e = $(element);
      // unwrap all values
      _.each(value, function(v, key) {
        value[key] = ko.utils.unwrapObservable(v);
      });
      // set some defaults for the animation
      value = _.defaults(value, { 
        duration: 250,
        connected: '',
        easing: 'linear'
      });
      
      // Show the new element
      if( value.show == true ) {
        if($(element).css('display') == 'none') {
          e.show();
          var connected = getConnected(value.connected),
              newHeight = e.height(),
              wrap = e.wrap('<div>');
          e.data('originalHeight', newHeight);
          wrap.css({ 'overflow-y': 'hidden', height: connected.height() + 'px', opacity: 0 });
          wrap.animate({ height: newHeight + 'px', opacity: 1 }, value.duration, value.easing, function() {
            wrap.css({ 'overflow-y': '', height: '', width: '', opacity: '' });
            e.unwrap();
            e.data('originalHeight', null);
          });
        }
      }
      // Hide the old element if it's shown
      else if($(element).css('display') == '' || $(element).css('display') == 'block') {
        var self = this,
            wrap = e.wrap('<div>');
        // Sometimes, this is called before the new element has a chance to appear, causing
        // the scroll position to get messed up while this element is positioned absolutely
        // and the new element is still hidden.
        var oldScrollTop = $(window).scrollTop();
        _.delay(function() { $(window).scrollTop(oldScrollTop); }, 10);
        wrap.css({ 'overflow-y': 'hidden', position: 'absolute', top: 0, left: 0, opacity: 1, width: e.width() });
        var connected = getConnected.call(self, value.connected),
            newHeight = connected.data('originalHeight') || connected.height();
        e.show();
        wrap.animate({ height: newHeight + 'px', opacity: 0 }, value.duration-50, value.easing, function() {
          wrap.css({ 'overflow-y': '', height: '', width: '', opacity: '', position: '', top: '', left: '' });
          wrap.hide();
          e.hide().unwrap();
        });
      }
    }
  }
};