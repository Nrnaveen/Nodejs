$(document).ready(function() {
	$("#usernew").validate({
		rules:{
			first_name: 'required',
			last_name: 'required',
			email: { required: true, email: true, },
			password: { required: true, minlength: 8, },
			confirm_password: { required: true, minlength: 8, equalTo: "#password", },
		},
		messages:{
			first_name: 'Please Enter First Name Field',
			last_name: 'Please Enter Last Name Field',
			email: { required: "Please Enter email Field", email: "Please Enter Valid Email", },
			password:{ required: "Please Enter Password Field", minlength: "Your Password Must be Atleast 8 Characters Long", },
			confirm_password:{ required: "Please Enter Confirm Password Field", minlength: "Your Conform Password Must be Atleast 8 Characters Long", equalTo: "Password and Conform Password does not Match", },
		},
	});
	$("#changePassword").validate({
		rules:{
			password: { required: true, minlength: 8, },
			confirm_password: { required: true, minlength: 8, equalTo: "#password", },
		},
		messages:{
			password:{ required: "Please Enter Password Field", minlength: "Your Password Must be Atleast 8 Characters Long", },
			confirm_password:{ required: "Please Enter Confirm Password Field", minlength: "Your Conform Password Must be Atleast 8 Characters Long", equalTo: "Password and Conform Password does not Match", },
		},
	});
	$("#profile").validate({
		rules:{
			first_name: 'required',
			last_name: 'required',
			email: { required: true, email: true, },
			image: { extension: "jpg|JPEG|jpeg|png", },
		},
		messages:{
			first_name: 'Please Enter First Name Field',
			last_name: 'Please Enter Last Name Field',
			email: { required: "Please Enter email Field", email: "Please Enter Valid Email", },
			image: { extension: "Please upload image only with extension (jpg|JPEG|jpeg|png)", },
		},
	});
	$("#plan").validate({
		rules:{
			name: 'required',
			description: 'required',
			time: { required: true, number: true, },
			price: 'required',
			text: "required",
			button_text: "required",
		},
		messages:{
			name: 'Please Enter Name Field',
			description: 'Please Enter Description Field',
			time: { required: "Please Enter Time Field", number: "Please Enter Numbers Only", },
			price: "Please Enter Price Field",
		},
	});

	$("#booking").validate({
		rules:{
			email: { required: true, email: true, },
			start: { required: true,  },
			price: { required: true, number: true, },
			duration: { required: true, number: true, },
		},
		messages:{
			email: { required: "Please Enter email Field", email: "Please Enter Valid Email", },
		},
	});

	$("#plannew").validate({
		rules:{
			name: 'required',
			description: 'required',
			time: { required: true, number: true, },
			price: 'required',
			text: "required",
			button_text: "required",
			image: {
				required: true,
				// accept: "image/*",
				extension: "jpg|JPEG|jpeg|png",
			}
		},
		messages:{
			name: 'Please Enter Name Field',
			description: 'Please Enter Description Field',
			time: { required: "Please Enter Time Field", number: "Please Enter Numbers Only", },
			price: "Please Enter Price Field",
		},
	});
});