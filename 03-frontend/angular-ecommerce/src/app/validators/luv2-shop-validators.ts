import { FormControl, ValidationErrors } from '@angular/forms';
export class Luv2ShopValidators {

    // whitespace validation
    // if validation check fails then return validation error(s)
    // if validation check passes then return null
    // ValidationErrors is a map of errors returned from failed validation checks
    // * it is a convention to name the validator key after the validation method 
    static notOnlyWhitespace(control: FormControl): ValidationErrors|null {

        // check if string only contains whitespace
        if ((control.value != null) && (control.value.trim().length === 0)) {

            // invalid, return error object with true
            // 'notOnlyWhitespace' is a key that will be checked by the html template
            return { 'notOnlyWhitespace': true };
        }
        
        else {
            // valid, return null
            // valid, return error object with false
            // return { 'notOnlyWhitespace': false };
            return null;
        }
    }
}
