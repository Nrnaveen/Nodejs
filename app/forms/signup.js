var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;
var reg_form = forms.create({
	firstname: fields.string({
		required: true,
		widget: forms.widgets.text({ classes: ['form-control'], }),
		cssClasses: { field: ['form-group'], },
	}),
	lastname: fields.string({
		required: true,
		widget: forms.widgets.text({ classes: ['form-control'], }),
		cssClasses: { field: ['form-group'], },
	}),
	email: fields.email({
		required: true,
		widget: forms.widgets.email({ classes: ['form-control'], }),
		cssClasses: { field: ['form-group'], },
	}),
	password: fields.password({
		required: validators.required('You definitely want a password'),
		widget: forms.widgets.password({ classes: ['form-control'], }),
		cssClasses: { field: ['form-group'], },
	}),
	confirmpassword:  fields.password({
		required: validators.required('don\'t you know your own password?'),
		validators: [validators.matchField('password')],
		widget: forms.widgets.password({ classes: ['form-control'], }),
		cssClasses: { field: ['form-group'], },
	}),
});
module.exports = { signup_form: reg_form };