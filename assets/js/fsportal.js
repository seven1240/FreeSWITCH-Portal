var App = Ember.Application.create({
	LOG_TRANSITIONS: true,
	rootElement: $('#container'),
	total: 0,
	ready: function(){
	}
});

App.CallsRoute = Ember.Route.extend({
	setupController: function(controller) {
		// Set the IndexController's `title`
		// controller.set('title', "My App");
		// alert("a")
		console.log("callsRoute");
		App.callsController.load();
  	}//,
  	// renderTemplate: function() {
	// this.render('calls');
  	// }
});

App.ChannelsRoute = Ember.Route.extend({
	setupController: function(controller) {
		// Set the IndexController's `title`
		// controller.set('title', "My App");
		// alert("a")
		console.log("callsRoute");
		App.channelsController.load();
  	}//,
  	// renderTemplate: function() {
		// this.render('calls');
  	// }
});


App.ShowApplicationsRoute = Ember.Route.extend({
	setupController: function(controller) {
		// Set the Controller's `title`
		controller.set('title', "ShowApplications");
		console.log("showApplications");
		App.applicationsController.load();
  	}//,
  	// renderTemplate: function() {
		// this.render('calls');
  	// }
});

App.ShowEndpointsRoute = Ember.Route.extend({
	setupController: function(controller) {
		// Set the Controller's `title`
		controller.set('title', "ShowEndpoints");
		console.log(controller);
		App.showEndpointsController.load();
  	}//,
  	// renderTemplate: function() {
		// this.render('calls');
  	// }
});

App.ShowCodecsRoute = Ember.Route.extend({
	setupController: function(controller) {
		App.showCodecsController.load();
  	}
});

App.UsersRoute = Ember.Route.extend({
	setupController: function(controller) {
		App.usersController.load();
  	}
});

App.Router.map(function(){
	this.route("calls");
	this.route("channels");
	this.route("showApplications");
	this.route("showEndpoints");
	this.route("showCodecs");
	this.route("showFiles");
	this.route("showAPIs");
	this.route("show");
	this.route("users");
	this.route("about", { path: "/about" });
});

App.User = Em.Object.extend({
	id: null,
	context: null,
	domain: null,
	group: null,
	contact: null
});

App.Call = Em.Object.extend({
	uuid: null,
	cidName: null,
	cidNumber: null

});

App.Channel = Em.Object.extend({
	uuid: null,
	cidName: null,
	cidNumber: null

});

App.callsController = Ember.ArrayController.create({
	content: [],
	init: function(){
	},
	load: function() {
		var me = this;
		$.getJSON("/api/show?calls%20as%20json", function(data){
			  // var channels = JSON.parse(data);
			console.log(data.row_count);
			me.set('total', data.row_count);
			me.content.clear();
			if (data.row_count == 0) return;

			// me.pushObjects(data.rows);
			data.rows.forEach(function(r) {
				me.pushObject(App.Call.create(r));
			});

		});
	},
	dump: function(uuid) {
		var obj = this.content.findProperty("uuid", uuid);
		console.log(obj.getProperties(["uuid", "cid_num"]));
	}
});

App.channelsController = Ember.ArrayController.create({
	content: [],
	init: function(){
	},
	load: function() {
		var me = this;
		$.getJSON("/api/show?channels%20as%20json", function(data){
			  // var channels = JSON.parse(data);
		 	console.log(data.row_count);
			me.set('total', data.row_count);
			me.content.clear();
			if (data.row_count == 0) return;
			data.rows.forEach(function(row) {
				me.pushObject(App.Channel.create(row));
		 	});

		});
	},
	delete: function(uuid) {
		var obj = this.content.findProperty("uuid", uuid);
		if (obj) this.content.removeObject(obj);// else alert(uuid);
	},
	dump: function(uuid) {
		var obj = this.content.findProperty("uuid", uuid);
		console.log(obj.getProperties(["uuid", "cid_num"]));
	}

});

App.applicationsController = Ember.ArrayController.create({
	content: [],
	init: function(){
	},
	load: function() {
		var me = this;
		$.getJSON("/api/show?application%20as%20json", function(data){
			  // var channels = JSON.parse(data);
			console.log(data.row_count);
			me.set('total', data.row_count);
			me.content.clear();
			if (data.row_count == 0) return;

			me.pushObjects(data.rows);

		});
	}
});

App.showEndpointsController = Ember.ArrayController.create({
	content: [],
	init: function(){
	},
	load: function() {
		var me = this;
		$.getJSON("/api/show?endpoints%20as%20json", function(data){
			  // var channels = JSON.parse(data);
			console.log(data.row_count);
			me.set('total', data.row_count);
			me.content.clear();
			if (data.row_count == 0) return;

			me.pushObjects(data.rows);

		});
	}
});

App.showCodecsController = Ember.ArrayController.create({
	content: [],
	init: function(){
	},
	load: function() {
		var me = this;
		$.getJSON("/api/show?codec%20as%20json", function(data){
			  // var channels = JSON.parse(data);
			console.log(data.row_count);
			me.set('total', data.row_count);
			me.content.clear();
			if (data.row_count == 0) return;

			me.pushObjects(data.rows);

		});
	}
});

App.usersController = Ember.ArrayController.create({
	content: [],
	init: function(){
	},
	load: function() {
		var me = this;
		$.get("/api/list_users", function(data){
			  // var channels = JSON.parse(data);
			console.log(data);
			lines = data.split("\n");
			console.log(lines);
			me.content.clear();
			var users = [];
			for (var i=1; i<lines.length; i++) {
				var line = lines[i];
				var fields = line.split("|");
				if (fields.length == 1) break;
				var user = {
					id: fields.shift(),
					context: fields.shift(),
					domain: fields.shift(),
					group: fields.shift(),
					contact: fields.shift(),
					callgroup: fields.shift(),
					cid_name: fields.shift(),
					cid_number: fields.shift()
				}
				// me.pushObject(App.User.create(user));
				users.push(App.User.create(user));
			}
				me.pushObjects(users);
		});
	}
});

App.initialize();

