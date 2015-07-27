angular.module('SharendaApp',[
	'ngRoute',
	'ngCookies',
	'ngLocale',
	'SharendaApp.Account',
	'SharendaApp.Category',
	'SharendaApp.Contact',
	'SharendaApp.Appointment',
	'SharendaApp.Settings',
	'SharendaApp.Professionnel',
	'angularFileUpload',
	'selectize',
])
.directive('color',function($compile) {
	return {
		type:'A',
		require: '^ngModel',
    		scope: {ngModel: '='},
		link:function(scope,element,attrs){
			$(element).colorpicker({
				color: scope.ngModel
			}).on("change.color", function(event, color){
			   scope.ngModel = color;
			});
			scope.$watch('ngModel',function() {
				$(element).colorpicker('val',scope.ngModel);
			});
		}
	}
})
.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
})
.factory('ContactService',function($http) {
	contactService = {};
	contactService.getContact = function(callback) {
		$http.get(window.BASE_URL+'contact').success(function(data) {
			contacts=[];
			angular.forEach(data.contact,function(value){
				value['state']=false;
				value['name'] = value.first_name+" "+value.last_name;
				contacts.push(value);
			});
			callback(contacts);
		});
	};
	contactService.createContact = function(data,callback) {
		$http.post(window.BASE_URL+'contact',data).success(function(res) {
			callback(res);
		}).error(function(res) {
			callback(res);
		});
	};
	contactService.deleteContact = function(data,callback) {
		$http.delete(window.BASE_URL+'contact/'+data).success(function(res) {
			callback(res);
		}).error(function(res) {
			callback(res);
		});
	};
	contactService.updateContact = function(data,callback) {
		$http.put(window.BASE_URL+'contact/'+data.id,data).success(function(res) {
			callback(res);
		}).error(function(res) {
			callback(res);
		});
	};
	return contactService;
})
.factory('EventService',function($http) {
	eventService = {};
	eventService.getEvent = function(callback) {
		var num = -1;
		$http.get(window.BASE_URL+'events?offset='+num).success(function(data) {
			callback(data);
		}).error(function(data) {
			callback(data);
		});
	};
	eventService.getPageEvent = function(data,callback) {
		$http.get(window.BASE_URL+'events?offset='+data).success(function(data) {
			callback(data);
		}).error(function(data) {
			callback(data);
		});
	};
	eventService.getClientEvent = function(callback) {
		$http.get(window.BASE_URL+'client/events?offset='+0).success(function(data) {
			callback(data);
		}).error(function(data) {
			callback(data);
		});
	};
	eventService.getClientPageEvent = function(data,callback) {
		$http.get(window.BASE_URL+'client/events?offset='+data).success(function(data) {
			callback(data);
		});
	};
	eventService.createEvent = function(data,callback) {
		data['client_id'] = data['client_id'][0];
		data['category_id'] = data['category_id'][0];
		data['time'] = data['time'][0];
		data['purpose'] = data['purpose'];
		$http.post(window.BASE_URL+'events',data).success(function(res) {
			callback(res);
		}).error(function(res) {
			callback(res);
		});
	};
	eventService.deleteEvent = function(data,callback){
		$http.delete(window.BASE_URL+'events/'+data).success(function(res) {
			callback(res);
		}).error(function(res) {
			callback(res);
		});
	};
	eventService.updateEvent = function(id,data,callback){
		data['client_id'] = data['client_id'][0];
		data['category_id'] = data['category_id'][0];
		data['time'] = data['time'][0];
		data['purpose'] = data['purpose'];
		$http.put(window.BASE_URL+'events/'+id,data).success(function(res) {
			callback(res);
		}).error(function(res) {
			callback(res);
		});
	};
	eventService.changeStatus = function(event_id,status,callback){
		$http.put(window.BASE_URL+'events/status',{id: event_id,status: status}).success(function(data) {
			callback(data);
		}).error(function(data) {
			callback(data);
		});
	};
	eventService.changeClientStatus = function(event_id,status,callback){
		$http.put(window.BASE_URL+'client/events/status',{id: event_id,status: status}).success(function(data) {
			callback(data);
		}).error(function(data) {
			callback(data);
		});
	};
	eventService.updateUserEvent = function(id,data,callback){
		$http.put(window.BASE_URL+'events/userevent/'+id,data).success(function(res) {
			callback(res);
		}).error(function(res) {
			callback(res);
		});
	};

	eventService.checkAvailability = function(id,data,callback){
		data['client_id'] = data['client_id'][0];
		data['category_id'] = data['category_id'][0];
		data['time'] = data['time'][0];
		data['purpose'] = data['purpose'];
		$http.put(window.BASE_URL+'events/check/'+id,data).success(function(res){
			callback(res);
		}).error(function(res) {
			callback(res);
		});
	};
	eventService.eventAvailability = function(data,callback){
		if(data.description == null){
		data.description = "N/A";}
		data['client_id'] = data['client_id'][0];
		data['category_id'] = data['category_id'][0];
		data['time'] = data['time'][0];
		data['purpose'] = data['purpose'];
		$http.post(window.BASE_URL+'events/check/availabilty',data).success(function(res){
			callback(res);
		}).error(function(res) {
			callback(res);
		});
	};

	return eventService;
})
.factory('AlertService',function($http) {
	var alertService = {};
	alertService.success = function(message) {
		noty({text: message,type: 'success',layout:'topRight',timeout: 5000});
	};
	alertService.error = function(message) {
		noty({text: message,type: 'error',layout:'topRight',timeout: 5000});
	};
	alertService.info = function(message) {
		noty({text: message,type: 'information',layout:'topRight',timeout: 5000});
	};
	alertService.progressInfo = function(message) {
		noty({text: message,type: 'information',layout:'topRight',timeout: 5000});
	};
	alertService.warning = function(message) {
		noty({text: message,type: 'warning',layout:'topRight',timeout: 5000});
	};
	return alertService;
})
.filter('timestamp', function() {
   return function filterFn(input) {
      return date = Date.parse(input) || 0;
    }
})
.factory('CategoryService',function($http) {
	categoryService = {};
	categoryService.createCategory = function(data,callback){
		$http.post(window.BASE_URL+'event-category',data).success(function(res) {
			callback(res);
		}).error(function(res) {
			callback(res);
		});
	};
	categoryService.deleteCategory = function(data,callback){
		$http.delete(window.BASE_URL+'event-category/'+data).success(function(res) {
			callback(res);
		}).error(function(res) {
			callback(res);
		});
	};
	categoryService.updateCategory = function(data,callback){
		$http.put(window.BASE_URL+'event-category/'+data.id,data).success(function(res) {
			callback(res);
		}).error(function(res) {
			callback(res);
		});
	};
	return categoryService;
})
.factory('ProfileService',function($http) {
	profileService = {};
	profileService.updateProfile = function(data,callback) {
	 	$http.post(window.BASE_URL+'user/profile',data).success(function(res) {
	 		callback(res);
	 	}).error(function(res) {
			callback(res);
		});
	 };
	 profileService.getProf = function(callback) {
	 	$http.get(window.BASE_URL+'profession').success(function(res) {
	 		callback(res);
	 	}).error(function(res) {
			callback(res);
		});
	 };
	 profileService.getUserProf = function(callback) {
	 	$http.get(window.BASE_URL+'professionnel/profile').success(function(res) {
	 		callback(res);
	 	}).error(function(res) {
			callback(res);
		});
	 };
	 profileService.postUserProf = function(data,callback) {
	 	$http.post(window.BASE_URL+'professionnel/profile',data).success(function(res) {
	 		callback(res);
	 	}).error(function(res) {
			callback(res);
		});
	 };
	return profileService;
})
.factory('UserService',function($http) {
	 userService = {};
	 userService.getInfo = function(callback) {
	 	$http.get(window.BASE_URL+'user/info').success(function(data) {
	 		callback(data);
	 	}).error(function(res) {
			callback(res);
		});
	 };
	 userService.updateProfileInfo = function(data,callback) {
	 	$http.post(window.BASE_URL+'user/info',data).success(function(res) {
	 		callback(res);
	 	}).error(function(res) {
	 		console.log(res);
			callback(res);
		});
	 };
 	return userService;
})
.controller('ApplicationController',['$scope','UserService','AlertService','$location','ContactService','EventService','ProfileService',function($scope,UserService,AlertService,$location,ContactService,EventService,ProfileService) {
	$scope.userEvents = [];
	$scope.Contacts= [];
	$scope.currentPath = '/';
	$scope.LOCALE= window.LOCALE_FR;
	$scope.$on('$routeChangeStart', function(next, current) { 
		$scope.currentPath = $location.path()
	});
	$scope.viewOptions = [
		{value: 'month',label: $scope.LOCALE.Monthly},
		{value: 'agendaWeek',label: $scope.LOCALE.Weekly},
		{value: 'agendaDay',label: $scope.LOCALE.Day},
	];
	$scope.config = {
		valueField: 'value',
		labelField: 'label',
		sort: false,
		maxItems: 1,
	};
	$scope.categoryConfig = {
		valueField: 'id',
		labelField: 'name',
		maxItems: 1,
		placeholder: 'Choisir une catégorie',
	};
	$scope.contactConfig = {
		valueField: 'id',
		labelField: 'name',
		maxItems: 1,
		placeholder: 'Choisissez un contact'
	}
	$scope.purposeConfig = {
		valueField: 'id',
		labelField: 'name',
		maxItems: 1,
		placeholder: 'Choisissez une raison'
	}
	$scope.dateView = 'month';
	$scope.baseUrl = window.BASE_URL;
	$scope.profileUrl = window.BASE_URL+'profile/';
	$scope.userImage = window.BASE_URL+'upload/';
	$scope.BASE_URL = window.BASE_URL+'/ng/';
	$scope.IMAGE_URL = window.BASE_URL+'/assets/images/';
	$scope.LOGOUT_URL = window.LOGOUT_URL;	
	$scope.ACCOUNT_URL =window.BASE_URL+'account#/';
	$scope.hideChangePassword = true;	
	$scope.user = {};
	$scope.userCategories = [];
	$scope.image = '';
	UserService.getInfo(function(data) {
		$scope.user = data.details;
		if(data.details.role=='professionnel'){
			$scope.userCategories = $scope.user.categories;
			ProfileService.getUserProf(function(data) {
				$scope.image=data.details.image;
			});
		}else if(data.details.role=='client'){
			window.location.href = $scope.ACCOUNT_URL+'professionnel';
		}
	});
	$scope.toggleChangePassword = function() {		
		$scope.hideChangePassword =  $scope.hideChangePassword ? false : true;
		if($scope.hideChangePassword) {
			$scope.user.newpassword = null;
			$scope.user.oldpassword = null;
			$scope.user.confirmpasswd = null;
		}
	};
	$scope.$on('createEvent',function(res) {
		EventService.getEvent(function(data) {
			$scope.userEvents = data.all_events;
		});
	});
	$scope.$on('createCategory',function(res) {
		UserService.getInfo(function(data) {
			$scope.user = data.details;
			$scope.userCategories = $scope.user.categories;
		});
	});
	$scope.$watchCollection('user', function() {
	});
	$scope.saveDetails = function(data)  {
		UserService.updateProfileInfo(data,function(res) {
			if(res.__all__.status){
				AlertService.success(res.__all__.message);
				$('#myDetails').modal('hide');
			}else if(!res.__all__.status){
				var arr = [];
				angular.forEach(res.errors,function(k,v){
					arr.push(k);
				});
				AlertService.error(arr[0]);
			}
		});
	};

	// start
	$scope.setEventTime = function(text){
                     options = [];
		start = 0;
		end = 24;
		for(var i = start; i < end; i+=0.15) {
			time = i.toFixed(2);
			min = (time%1).toFixed(2);
			if(min == 0.60) {
				i+= 0.40;
				val = i.toFixed(2);
				if(parseFloat(val) < 10){
					op = '0'+float2int(val)+":"+val.split(".")[1];
					options.push({value:'0'+val,text:op});
				}else{
					op = float2int(val)+":"+val.split(".")[1];
					options.push({value:val,text:op});
				}
				continue;
			};
			if(parseFloat(time) < 10){
				op = '0'+float2int(time)+":"+time.split(".")[1];
				options.push({value:'0'+time,text:op});
			}else{
				op = float2int(time)+":"+time.split(".")[1];
				options.push({value:time,text:op});
			}
		}
		options.pop();
                     return $.grep(options,function(n,i){
                               return n.text == text;
                     });
           };
	float2int = function(value) {
		return value | 0;
	};
	$scope.durationfunction = function(){
		var options = [];
		for(i = 0; i < 24; i++ ){
			if(i !=0 ){
				value = i * 60;
				options.push({text: i+' h',value: value});
			}
			end = 0.05;
			for( j = 0.05; j <= 0.60; j+= end){
				val = parseInt(i) + parseFloat(j.toFixed(2));
				min = j.toFixed(2).toString().split(".")[1];
				ele = i + 0.15;
				if(i ==0 ){
					value = i * 60;
					value = parseInt(value)+parseInt(min);
					options.push({text: min+' mn',value: value});
				}else{
					value = i * 60;
					value = parseInt(value)+parseInt(min);
					options.push({text: i+' h '+min+' mn',value: value});
				}
				if(val >= ele){
					end = 0.15;
				}
			}
		}
		return options;
	};
	$scope.durationConfig = {
		valueField: 'value',
		labelField: 'text',
		sort: false,
		sortField: [],
		placeholder: 'heure',
		maxItems: 1,
	};
	$scope.durationOption = $scope.durationfunction();
	// end

}])
.directive('popover',function($compile) {
	return {
		type:'A',
		link:function(scope,element,attrs){
			var html = attrs.html;
			html = $compile(html)(scope);
			$(element).popover({
				html:true,
				placement:attrs.popover,
				content: html
			}).on('shown.bs.popover',function() {
				$('.popover-destroy:visible').on('click',function() {
					$(element).popover('hide');
				});
			});			
		}
	}
})
.directive('inputcheck',function() {
	return {
		type: 'A',
		link:function(scope,element,attrs){
			$(element).iCheck({
				checkboxClass: 'icheckbox_flat',
				radioClass: 'iradio_flat',
			}).on('ifChecked',function(){
				scope.checkedButton = true;
				//scope.$emit('checkboxClick',scope.contact)
				//scope.contact.state = true;
				// scope.viewContact(scope.contact);
				// scope.$apply();
			});
		}
	}
})
.directive('datepicker',function() {
	return {
		type: 'A',
		link: function(scope,element,attrs) {
			$(element).pickadate({
				min : true,
				monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
				weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
				today: 'aujourd\'hui',
				clear: 'effacer',
				format: 'dd/mm/yyyy',
				formatSubmit: 'dd/mm/yyyy',
			}).on('change',function(datepicker) {
				scope.appointment.start = moment($(this).val(),'DD/MM/YYYY').locale('fr').format('DD/MM/YYYY');
			});
		}
	};
})
.directive('calendar',function() {
	return {
		type: 'A',
		link: function(scope,element,attrs) {
			
			var options = {
				header: {
					left: '',
					center: '',
					right: '',
				},
		 		defaultDate: new Date(),
		 		editable: false,
		 		eventLimit: true,
		 		eventStartEditable: false,
		 		lang:'fr',
				dayClick:function(event,jsEvent,view){
					scope.appointment= {};
				          $('#modalTitle').html(event.title);
				          $('#modalBody').html(event.description);
				          scope.appointment.start = moment(event).format('DD/MM/YYYY');
				          scope.appointment.duration = 30;
				          scope.event.$submitted = false;
				          scope.$apply();
				          $('.picker-date').val(moment(event).format('DD/MM/YYYY'));
				          $('#eventModal').modal();

				           // start
					if(view.name != 'month'){
						time = scope.setEventTime(moment(event).format("HH:mm"));
						if(time[0].value){
							$select = $(document.getElementById('timeDrop')).selectize(options);
							selectize = $select[0].selectize;
							selectize.setValue(time[0].value);
						}
					}
					// end

				},
				eventClick:function(event,jsEvent,view){
					scope.event.$submitted = true;
					$('#event-id').val(event.id);
					$('#updatemodalTitle').html(event.title);
					//$('#updatenote1').val(event.title);
					//$('.picker-date').val(moment(event.start).format('MM/DD/YYYY'));
					$('#updateeventModal').modal();
					scope.loadEventData(event.id);
				},
				eventRender: function(event, element)
				{ 
				    element.find('.fc-event-title').html(event.description);
				    element.find('.fc-event-time').html(event.contact);
				    return element;
				}
			};



			function lighten(color, luminosity) {
				color = color.replace('#','');
				// validate hex string
				color = new String(color).replace(/[^0-9a-f]/gi, '');
				if (color.length < 6) {
					color = color[0]+ color[0]+ color[1]+ color[1]+ color[2]+ color[2];
				}
				luminosity = luminosity || 0;

				// convert to decimal and change luminosity
				var newColor = "#", c, i, black = 0, white = 255;
				for (i = 0; i < 3; i++) {
					c = parseInt(color.substr(i*2,2), 16);
					c = Math.round(Math.min(Math.max(black, c + (luminosity * white)), white)).toString(16);
					newColor += ("00"+c).substr(c.length);
				}
				return newColor; 
			}



			var element = $(element);
			element.fullCalendar(options);
			//agendaWeek
			//agendaDay
			//month
			//element.fullCalendar( 'changeView', 'agendaWeek' );

			function setTitle() {
				var view = element.fullCalendar('getView');
				$('*[data-title]').text(view.title); 
			}

			

			$('*[data-prev]').on('click',function() {
				element.fullCalendar('prev');
				setTitle();
			});

			$('*[data-next]').on('click',function() {
				element.fullCalendar('next');
				setTitle();
			});
			setTitle();

			scope.$watch('dateView',function() {
				element.fullCalendar('changeView',scope.dateView);
				setTitle();
			});

			$('*[data-today]').on('click',function() {
				element.fullCalendar('today');
				setTitle();
			});

			var getEvents = function(e) {
				events = [];
				angular.forEach(e,function(event) {
					row = {
						id: event.id,
						// title: event.created_by ?  "Personal Consultations" : event.client.first_name+' '+event.client.last_name,
						// title: event.client.first_name+' '+event.client.last_name,
						title: event.server ? event.description : event.client.first_name+' '+event.client.last_name,
						start: event.start_datetime,
						end: event.end_datetime,
						description: event.description,
						status:event.status,
						textColor:'white',
					};
					if(event.client) {
						row['contact'] = event.client.first_name + ' ' +event.client.last_name;
					}
					if(event.category){
						row['color'] = event.category.color;
						row['borderColor'] = lighten(event.category.color,-0.10);
					}
					events.push(row);
				});
				return events;
			};
			scope.$watch('userEvents',function(){
				 var events = getEvents(scope.userEvents);
				 element.fullCalendar('removeEvents');
				 element.fullCalendar('addEventSource',events);         
				
			});
		}
	};
});