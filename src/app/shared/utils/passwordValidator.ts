import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {

    return (control: AbstractControl): { [key: string]: boolean } | null => {

        const password = control.value;

        if (!password) {
            // If the password field is empty, return null (no validation error).
            return null;
        }

        // Regular expressions for password validation
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const numberRegex = /\d/;
        const symbolRegex = /[!@#$%^&*()_+[\]{};':"\\|,.<>?]/;

        // Check if the password meets all the complexity requirements
        const isLengthValid = password.length >= 8;
        const hasUppercase = uppercaseRegex.test(password);
        const hasLowercase = lowercaseRegex.test(password);
        const hasNumber = numberRegex.test(password);
        const hasSymbol = symbolRegex.test(password);

        const isPasswordValid = isLengthValid && hasUppercase && hasLowercase && hasNumber && hasSymbol;

        // If the password meets all the requirements, return null (no validation error).
        // Otherwise, return the validation error object.
        return isPasswordValid ? null : { invalidPassword: true };
        
    };

}
