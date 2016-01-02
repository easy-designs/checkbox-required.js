/*! Easy Checkbox Required (c) Aaron Gustafson (@AaronGustafson). MIT License. http://github.com/easy-designs/easy-checkbox-required.js */

/* Easy Checkbox Required API
 * 
 * One pain point in HTML5 validation is checkbox groups as you cannot simply
 * use the "required" attribute as it would require the inclusion of each 
 * checkbox that is part of the group. This script fixes that by using a data
 * attribute -- `data-checkbox-required` -- to indicate the requirement.
 * 
 * Adding the `data-checkbox-required` attribute to one or more checkboxes 
 * in a group would require at least one checkbox be chosen, but you can 
 * specify lower and upper bounds by giving a value to the attribute. For 
 * example:
 * 
 * 		<input type="checkbox" name="test[]" value="1"
 *			data-checkbox-required="3" />
 * 
 * Would require at least 3 checkboxes in the group be checked
 * 
 * 		<input type="checkbox" name="test[]" value="1"
 *			data-checkbox-required="3-5" />
 * 
 * Would require at least 3, but no more than 5 checkboxes in the group be
 * checked.
 * 
 * 		<input type="checkbox" name="test[]" value="1"
 *			data-checkbox-required="0-5" />
 * 
 * Would require any number (including 0), up to 5 checkboxes in the group
 * be checked.
 * 
 **/
;(function( $, UNDEFINED ){
	
	// jQuery Requirement
	if ( $ == UNDEFINED ){ return; }

	var script_name = 'checkbox-required',
		selector = '[data-' + script_name + ']',
		error_key = script_name + '-error',
		container = 'form > ol > li, fieldset > ol > li',
		ERROR = 'validation-error',
		html5_validation = (function( props ){
			
			var input	= document.createElement('input');
			if ( typeof(input.setCustomValidity) != 'function' )
			{
            	return false;
			}
			return true;
		}()),
		set_error = function(){},
		remove_error = function(){};
		
	if ( html5_validation )
	{
		set_error = function( field, message )
		{
			field.setCustomValidity( message );
		};
		remove_error = function( field )
		{
			field.setCustomValidity( '' );
		};
	}
	// < HTML5 Errors
	else
	{
		set_error = function( field, message )
		{
			$(field).data( error_key, message );
		};
		remove_error = function( field )
		{
			$(field).removeData( error_key );
		};
	}
	
	function check_validity( e )
	{
		var $form = $(this).closest('form'),
			single_template = $form.data( script_name + '-message-template-single' ) || 'Please choose an option',
			min_template = $form.data( script_name + '-message-template-min' ) || 'Please choose at least {min} options',
			range_template = $form.data( script_name + '-message-template-range' ) || 'Please choose {min}-{max} options',
			max_template = $form.data( script_name + '-message-template-max' ) || 'Please choose at most {max} options',
			validated = [],
			error = false; // optimism
		
		$form.find(selector).each(function(){
			
			var $field = $(this),
				name = $field.attr('name'),
				required,
				checked,
				message;
			
			remove_error( this );

			// only once per name
			if ( $.inArray( name, validated ) != -1 )
			{
				return;
			}
			validated.push( name );
			
			// get the count
			required = $field.data( script_name ).toString().split('-');
			checked = $field.closest('form').find('[type=checkbox][name="' + name + '"]:checked').length;
			
			// empty defaults to one
			if ( required == '' )
			{
				required = [1];
			}
			
			// minimum
			if ( checked < required[0] )
			{
				error = true;
			}
			
			// maximum
			if ( error === false &&
				 required[1] != UNDEFINED &&
				 checked > required[1] )
			{
				error = true;
			}
			
			if ( error )
			{
				if ( required[1] == UNDEFINED )
				{
					message = required[0] == 1 ? single_template : min_template;
				}
				else
				{
					message = required[0] == 0 ? max_template : range_template;
				}
				
				message = message
							.replace( '{min}', required[0] )
							.replace( '{max}', required[1] );
				
				set_error( this, message );
				
				return false;
			}
			
		});
		
	}
	
	function validate_form( e )
	{
		
		var $form = $(this),
			has_validation_error = false,
			validated = [];
		
		$form.find(selector).each(function(){
			
			var field = this,
				$field = $(field),
				name = $field.attr('name');
			
			// only once per name
			if ( $.inArray( name, validated ) != -1 )
			{
				return;
			}
			validated.push( name );
			
			if ( $field.data( error_key ) != UNDEFINED )
			{
				has_validation_error = true;
				$field.closest( container )
					.addClass( ERROR );
			}
			else
			{
				$field.closest( container )
					.removeClass( ERROR );
			}

		});
		
		// return false if thereâ€™s an error (to stop form submission)
		return ! has_validation_error;
	}
	
	// loop through the fields
	$(selector).each(function(){
		
		// find the form
		var $form = $(this).closest('form');
		
		// only assign one event handler per form
		if ( $form.data(script_name) )
		{
			return;
		}

		$form
			// native validation requires assigning validity
			.on( 'script::load', check_validity )
			.on( 'change', selector, check_validity )
			
			// note that this form is already being watched
			.data( script_name, true )
			
			// init the validation
			.triggerHandler('script::load');
		
		// non-HTML5 validation requires tweaks on submit
		if ( ! html5_validation )
		{
			$form.on( 'submit', validate_form );
		}
		
	});
	
}(jQuery));