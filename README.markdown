Easy Checkbox Required
======================

One pain point in HTML5 validation is checkbox groups as you cannot simply
use the `require`" attribute as it would require the inclusion of each 
checkbox that is part of the group. This script fixes that by using a data
attribute -- `data-checkbox-required` -- to indicate the requirement.

Adding the `data-checkbox-required` attribute to one or more checkboxes 
in a group would require at least one checkbox be chosen, but you can 
specify lower and upper bounds by giving a value to the attribute. For 
example:

	<input type="checkbox" name="test[]" value="1"
	       data-checkbox-required="3"
	       >

Would require at least 3 checkboxes in the group be checked

	<input type="checkbox" name="test[]" value="1"
	       data-checkbox-required="3-5"
	       >

Would require at least 3, but no more than 5 checkboxes in the group be
checked.

	<input type="checkbox" name="test[]" value="1"
	       data-checkbox-required="0-5"
	       >

Would require any number (including 0), up to 5 checkboxes in the group
be checked.