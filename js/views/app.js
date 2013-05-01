/*global Backbone, _, $, ENTER_KEY, */
/*jshint unused:false */
var app = app || {};

(function ($) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#todoapp',

		// Our template for the line of statistics at the bottom of the app.
		statsTemplate: _.template($('#stats-template').html()),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress #new-todo': 'createOnEnter',
			'click #clear-completed': 'clearCompleted',
			'click #toggle-all': 'toggleAllComplete'
		},

		initialize: function () {
			this.allCheckbox = this.$('#toggle-all')[0];
			this.$input = this.$('#new-todo');
			this.$footer = this.$('#footer');
			this.$main = this.$('#main');

			this.listenTo(app.Todos, 'add', this.addOne);
			this.listenTo(app.Todos, 'reset', this.addAll);
			this.listenTo(app.Todos, 'change:completed', this.filterOne);
			this.listenTo(app.Todos, 'filter', this.filterAll);
			this.listenTo(app.Todos, 'all', this.render);

			app.Todos.fetch();
		},

		render: function () {
			var completed = app.Todos.completed().length;
			var remaining = app.Todos.remaining().length;

			$('.destroy, .toggle').hide();

			  $('.view').hover(function() {
	    
	    $(this).find('.destroy, .toggle').stop(true, true).delay(100).fadeIn(525, 'swing');
       
    		


    		}, function() {
        
        	$(this).find('.destroy, .toggle').stop(true, true).delay(50).fadeOut(525, 'swing');
       		});





			if (app.Todos.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.statsTemplate({
					completed: completed,
					remaining: remaining
				}));

				this.$('#filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (app.TodoFilter || '') + '"]')
					.addClass('selected');
			} else {
				this.$main.hide();
				this.$footer.hide();
			}

			this.allCheckbox.checked = !remaining;
		},


		addOne: function (todo) {
			
			// var view = new app.TodoView({ model: todo });
			var rendered = new app.TodoView({ model: todo }).render();
			$(rendered.el).prependTo('#todo-list').hide().fadeIn(500, 'swing');

			// $('#todo-list').prepend(view.render().el);


	
		},

		addAll: function () {
			this.$('#todo-list').html('');
			app.Todos.each(this.addOne, this);
		},

		filterOne: function (todo) {
			todo.trigger('visible');
		},

		filterAll: function () {
			app.Todos.each(this.filterOne, this);
		},

		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: app.Todos.nextOrder(),
				completed: false
			};

		},

		createOnEnter: function (e) {
			if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
				return;
			}

			app.Todos.create(this.newAttributes());
			this.$input.val('');
		},

		clearCompleted: function () {
			_.invoke(app.Todos.completed(), 'destroy');
			return false;
		},

		toggleAllComplete: function () {
			var completed = this.allCheckbox.checked;

			app.Todos.each(function (todo) {
				todo.save({
					'completed': completed
				});
			});
		}
	});
})(jQuery);