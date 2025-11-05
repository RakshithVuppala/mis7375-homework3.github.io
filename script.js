/*
Program name: script.js
Author: Rakshith Vuppala
Date created: October 20 2025
Date last edited: November 02 2025
Version: 3.0
Description: Form validation and review helper functions with real-time validation
*/

// Global validation state
let validationErrors = {};
let fieldTouched = {}; // Track which fields have been interacted with
let ssnActualValue = ''; // Store actual SSN value
let lastSSNMaskedLength = 0; // Track last masked length

// Set date limits on page load
function setDateLimits() {
    const dateInput = document.getElementById('dateOfBirth');
    if (!dateInput) return;

    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];

    const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    const minDateStr = minDate.toISOString().split('T')[0];

    dateInput.setAttribute('max', maxDate);
    dateInput.setAttribute('min', minDateStr);
}

// Convert User ID to lowercase as user types
function convertUserIDToLowercase() {
    const userIDInput = document.getElementById('desiredUserID');
    if (!userIDInput) return;

    userIDInput.addEventListener('input', function() {
        this.value = this.value.toLowerCase();
    });
}

// Convert Email to lowercase as user types
function convertEmailToLowercase() {
    const emailInput = document.getElementById('emailAddress');
    if (!emailInput) return;

    emailInput.addEventListener('input', function() {
        this.value = this.value.toLowerCase();
    });
}

// Format and mask SSN
function formatSSN(input) {
    let currentValue = input.value;
    let currentLength = currentValue.length;

    // Detect if user is adding or removing characters
    if (currentLength > lastSSNMaskedLength) {
        // User is typing - extract the new digit
        let newChar = currentValue.charAt(currentLength - 1);

        // Only process if it's a digit
        if (/\d/.test(newChar)) {
            // Add the digit to our actual value (max 9 digits)
            if (ssnActualValue.length < 9) {
                ssnActualValue += newChar;
            }
        }
    } else if (currentLength < lastSSNMaskedLength) {
        // User is deleting - remove last digit from actual value
        ssnActualValue = ssnActualValue.slice(0, -1);
    }

    // Create masked display value with dashes
    let maskedValue = '';
    for (let i = 0; i < ssnActualValue.length; i++) {
        maskedValue += 'X';
        // Add dashes after 3rd and 5th digit
        if (i === 2 || i === 4) {
            maskedValue += '-';
        }
    }

    // Update the field value
    input.value = maskedValue;

    // Store the new masked length for next comparison
    lastSSNMaskedLength = maskedValue.length;
}

// Format and truncate ZIP code
function formatZipCode(input) {
    let val = input.value.replace(/\D/g, '');

    // Truncate to maximum 5 digits
    if (val.length > 5) {
        val = val.slice(0, 5);
    }

    input.value = val;
}

// Validate password requirements
function validatePassword(password, userId, firstName, lastName) {
    const errors = [];

    if (password.length < 8 || password.length > 30) {
        errors.push('Must be 8-30 characters');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Must contain 1 uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Must contain 1 lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Must contain 1 digit');
    }
    if (!/[!@#%^&*()\-_+=\/><.,`~]/.test(password)) {
        errors.push('Must contain 1 special character');
    }
    if (/["']/.test(password)) {
        errors.push('Cannot contain quotes');
    }
    if (userId && password.toLowerCase().includes(userId.toLowerCase())) {
        errors.push('Cannot contain User ID');
    }
    if (firstName && password.toLowerCase().includes(firstName.toLowerCase())) {
        errors.push('Cannot contain first name');
    }
    if (lastName && password.toLowerCase().includes(lastName.toLowerCase())) {
        errors.push('Cannot contain last name');
    }

    return errors;
}

// Validate date of birth
function validateDateOfBirth(dob) {
    if (!dob) return 'Required field is empty';

    const dobDate = new Date(dob);
    const today = new Date();
    const age120 = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());

    if (dobDate > today) return 'Cannot be in the future';
    if (dobDate < age120) return 'Cannot be more than 120 years ago';

    return null;
}

// Get value from form field
function getFieldValue(fieldName) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return '';

    // Return actual SSN value instead of masked value
    if (fieldName === 'socialSecurity') {
        return ssnActualValue;
    }

    if (field.type === 'radio') {
        const checked = document.querySelector(`[name="${fieldName}"]:checked`);
        return checked ? checked.value : '';
    } else if (field.type === 'checkbox') {
        return field.checked ? 'Yes' : 'No';
    } else {
        return field.value;
    }
}

// Get all checked medical conditions
function getMedicalConditions() {
    const conditions = [];
    const conditionIds = ['hasChickenPox', 'hasMeasles', 'hasCovid19', 'hasSmallPox',
                          'hasTetanus', 'hasAllergies', 'hasDiabetes', 'hasHeartDisease'];

    conditionIds.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
            conditions.push(checkbox.nextElementSibling.textContent);
        }
    });

    return conditions.length > 0 ? conditions.join(', ') : 'None';
}

// Show review
function reviewForm() {
    // Personal Information
    document.getElementById('review-firstName').textContent = getFieldValue('firstName') || '(not entered)';
    document.getElementById('review-middleInitial').textContent = getFieldValue('middleInitial') || '(not entered)';
    document.getElementById('review-lastName').textContent = getFieldValue('lastName') || '(not entered)';
    document.getElementById('review-dateOfBirth').textContent = getFieldValue('dateOfBirth') || '(not entered)';
    document.getElementById('review-socialSecurity').textContent = getFieldValue('socialSecurity') ? '***-**-****' : '(not entered)';
    document.getElementById('review-gender').textContent = getFieldValue('gender') || '(not entered)';
    document.getElementById('review-preferredLanguage').textContent = getFieldValue('preferredLanguage') || '(not entered)';

    // Contact Information
    document.getElementById('review-addressLine1').textContent = getFieldValue('addressLine1') || '(not entered)';
    document.getElementById('review-addressLine2').textContent = getFieldValue('addressLine2') || '(not entered)';
    document.getElementById('review-city').textContent = getFieldValue('city') || '(not entered)';
    document.getElementById('review-state').textContent = getFieldValue('state') || '(not entered)';
    document.getElementById('review-zipCode').textContent = getFieldValue('zipCode') || '(not entered)';
    document.getElementById('review-emailAddress').textContent = getFieldValue('emailAddress') || '(not entered)';
    document.getElementById('review-phoneNumber').textContent = getFieldValue('phoneNumber') || '(not entered)';
    document.getElementById('review-emergencyContact').textContent = getFieldValue('emergencyContact') || '(not entered)';
    document.getElementById('review-emergencyPhone').textContent = getFieldValue('emergencyPhone') || '(not entered)';
    document.getElementById('review-preferredContactMethod').textContent = getFieldValue('preferredContactMethod') || '(not entered)';

    // Medical History
    document.getElementById('review-medicalConditions').textContent = getMedicalConditions();
    document.getElementById('review-isVaccinated').textContent = getFieldValue('isVaccinated') || '(not entered)';
    document.getElementById('review-hasInsurance').textContent = getFieldValue('hasInsurance') || '(not entered)';
    document.getElementById('review-currentSymptoms').textContent = getFieldValue('currentSymptoms') || '(not entered)';
    document.getElementById('review-healthRating').textContent = getFieldValue('healthRating') || '(not entered)';
    document.getElementById('review-painLevel').textContent = getFieldValue('painLevel') || '(not entered)';

    // Insurance Information
    document.getElementById('review-insuranceProvider').textContent = getFieldValue('insuranceProvider') || '(not entered)';
    document.getElementById('review-policyNumber').textContent = getFieldValue('policyNumber') || '(not entered)';
    document.getElementById('review-physicianName').textContent = getFieldValue('physicianName') || '(not entered)';
    document.getElementById('review-pharmacyName').textContent = getFieldValue('pharmacyName') || '(not entered)';

    // Account Setup
    const userId = getFieldValue('desiredUserID');
    document.getElementById('review-desiredUserID').textContent = userId ? userId.toLowerCase() : '(not entered)';
    document.getElementById('review-password').textContent = getFieldValue('password') ? '********' : '(not entered)';
    document.getElementById('review-confirmPassword').textContent = getFieldValue('confirmPassword') ? '********' : '(not entered)';

    // Consent
    document.getElementById('review-consentMarketing').textContent = getFieldValue('consentMarketing');
    document.getElementById('review-consentDataSharing').textContent = getFieldValue('consentDataSharing');

    // Validate and show status
    validateAllFields();

    // Show review area
    document.getElementById('reviewArea').style.display = 'block';
    document.getElementById('reviewArea').scrollIntoView({ behavior: 'smooth' });
}

// Validate all fields and update status
function validateAllFields() {
    const fields = ['firstName', 'middleInitial', 'lastName', 'dateOfBirth', 'socialSecurity',
                   'gender', 'preferredLanguage', 'addressLine1', 'addressLine2', 'city',
                   'state', 'zipCode', 'emailAddress', 'phoneNumber', 'emergencyContact',
                   'emergencyPhone', 'preferredContactMethod', 'medicalConditions',
                   'isVaccinated', 'hasInsurance', 'currentSymptoms', 'healthRating',
                   'painLevel', 'insuranceProvider', 'policyNumber', 'physicianName',
                   'pharmacyName', 'desiredUserID', 'password', 'confirmPassword',
                   'consentMarketing', 'consentDataSharing'];

    fields.forEach(fieldName => {
        const statusElement = document.getElementById('status-' + fieldName);
        if (!statusElement) return;

        const field = document.querySelector(`[name="${fieldName}"]`);
        const value = getFieldValue(fieldName);

        let error = null;

        // Check required fields
        if (field && field.hasAttribute('required') && !value) {
            error = 'Required field is empty';
        }

        // Field-specific validation
        if (fieldName === 'dateOfBirth' && value) {
            error = validateDateOfBirth(value);
        }

        if (fieldName === 'password' && value) {
            const userId = getFieldValue('desiredUserID');
            const firstName = getFieldValue('firstName');
            const lastName = getFieldValue('lastName');
            const passwordErrors = validatePassword(value, userId, firstName, lastName);
            if (passwordErrors.length > 0) {
                error = passwordErrors.join('; ');
            }
        }

        if (fieldName === 'confirmPassword' && value) {
            const password = getFieldValue('password');
            if (value !== password) {
                error = 'Passwords do not match';
            }
        }

        if (fieldName === 'addressLine2' && value && value.length > 0 && value.length < 2) {
            error = 'Must be 2-30 characters if entered';
        }

        // Update status
        if (error) {
            statusElement.textContent = 'ERROR: ' + error;
            statusElement.className = 'review-status error';
        } else {
            statusElement.textContent = 'pass';
            statusElement.className = 'review-status success';
        }
    });
}

// Close review
function closeReview() {
    document.getElementById('reviewArea').style.display = 'none';
}

// Form submission validation
function validateForm(event) {
    const errors = [];

    // Date of birth
    const dobError = validateDateOfBirth(getFieldValue('dateOfBirth'));
    if (dobError) errors.push('Date of Birth: ' + dobError);

    // Address Line 2
    const addr2 = getFieldValue('addressLine2');
    if (addr2 && addr2.length > 0 && addr2.length < 2) {
        errors.push('Address Line 2: Must be 2-30 characters if entered');
    }

    // Password
    const password = getFieldValue('password');
    const userId = getFieldValue('desiredUserID');
    const firstName = getFieldValue('firstName');
    const lastName = getFieldValue('lastName');
    const passwordErrors = validatePassword(password, userId, firstName, lastName);
    if (passwordErrors.length > 0) {
        errors.push('Password: ' + passwordErrors.join(', '));
    }

    // Password match
    const confirmPassword = getFieldValue('confirmPassword');
    if (password !== confirmPassword) {
        errors.push('Passwords do not match');
    }

    if (errors.length > 0) {
        event.preventDefault();
        alert('Please correct the following errors:\n\n' + errors.join('\n'));
        return false;
    }

    return true;
}

// Check if all required fields are filled
function areAllRequiredFieldsFilled() {
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'socialSecurity',
                           'gender', 'addressLine1', 'city', 'state', 'zipCode',
                           'emailAddress', 'phoneNumber', 'isVaccinated', 'hasInsurance',
                           'desiredUserID', 'password', 'confirmPassword'];

    for (let fieldName of requiredFields) {
        const value = getFieldValue(fieldName);
        if (!value || value.trim() === '') {
            return false;
        }
    }
    return true;
}

// Update error counter display
function updateErrorCounter() {
    const errorCount = Object.keys(validationErrors).filter(key => validationErrors[key]).length;
    const counterElement = document.getElementById('errorCounter');
    const submitBtn = document.querySelector('.submit-btn');
    const validateBtn = document.querySelector('.validate-btn');
    const allRequiredFilled = areAllRequiredFieldsFilled();

    if (counterElement) {
        counterElement.style.color = '';
        counterElement.style.fontWeight = '';

        if (errorCount > 0) {
            counterElement.textContent = `${errorCount} validation error${errorCount !== 1 ? 's' : ''} remaining`;
            counterElement.style.color = '#d32f2f';
            counterElement.style.fontWeight = 'bold';
        } else if (!allRequiredFilled) {
            counterElement.textContent = 'Fill out all required fields and click VALIDATE to check for errors';
            counterElement.style.color = '#666';
            counterElement.style.fontWeight = 'normal';
        } else {
            counterElement.textContent = 'All validations passed! You can now submit the form.';
            counterElement.style.color = '#2e7d32';
            counterElement.style.fontWeight = 'bold';
        }
    }

    // Show/hide submit button only when no errors AND all required fields filled
    if (submitBtn) {
        submitBtn.style.display = (errorCount === 0 && allRequiredFilled) ? 'inline-block' : 'none';
    }

    // Hide validate button when all validations pass
    if (validateBtn) {
        validateBtn.style.display = (errorCount === 0 && allRequiredFilled) ? 'none' : 'inline-block';
    }
}

// Validate a single field
function validateSingleField(fieldName, value) {
    let error = null;
    const field = document.querySelector(`[name="${fieldName}"]`);

    // For SSN, validate the actual value, not the masked display
    if (fieldName === 'socialSecurity') {
        value = ssnActualValue;
    }

    // Check if field is required
    if (field && field.hasAttribute('required') && !value) {
        error = 'Required field is empty';
    }

    // Field-specific validation
    switch(fieldName) {
        case 'firstName':
            if (value && !/^[A-Za-z'\-]{1,30}$/.test(value)) {
                error = 'Enter 1-30 characters, letters, apostrophes, and dashes only';
            }
            break;
        case 'middleInitial':
            if (value && !/^[A-Za-z]?$/.test(value)) {
                error = 'Enter single letter only';
            }
            break;
        case 'lastName':
            if (value && !/^[A-Za-z'\-\s0-9]{1,30}$/.test(value)) {
                error = 'Enter 1-30 characters, letters, apostrophes, dashes, spaces, and numbers allowed';
            }
            break;
        case 'dateOfBirth':
            if (value) {
                error = validateDateOfBirth(value);
            }
            break;
        case 'socialSecurity':
            if (value && !/^\d{9}$/.test(value)) {
                error = 'Must be exactly 9 digits';
            }
            break;
        case 'gender':
        case 'isVaccinated':
        case 'hasInsurance':
            // Radio buttons - just check if selected
            if (!value && field && field.hasAttribute('required')) {
                error = 'Required field - please select an option';
            }
            break;
        case 'addressLine1':
            if (value && (value.length < 2 || value.length > 30)) {
                error = 'Enter 2-30 characters';
            }
            break;
        case 'addressLine2':
            if (value && value.length > 0 && (value.length < 2 || value.length > 30)) {
                error = 'Must be 2-30 characters if entered';
            }
            break;
        case 'city':
            if (value && !/^[A-Za-z\s]{2,30}$/.test(value)) {
                error = 'Enter 2-30 characters, letters and spaces only';
            }
            break;
        case 'state':
            if (!value) {
                error = 'Please select a state';
            }
            break;
        case 'zipCode':
            if (value && !/^\d{5}$/.test(value)) {
                error = 'Must be exactly 5 digits';
            }
            break;
        case 'emailAddress':
            if (value && !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(value)) {
                error = 'Enter valid email: name@domain.tld';
            }
            break;
        case 'phoneNumber':
            if (value && !/^\(\d{3}\) \d{3}-\d{4}$/.test(value)) {
                error = 'Format: (XXX) XXX-XXXX';
            }
            break;
        case 'emergencyContact':
            if (value && !/^[A-Za-z\s]*$/.test(value)) {
                error = 'Letters and spaces only';
            }
            break;
        case 'emergencyPhone':
            if (value && !/^\(\d{3}\) \d{3}-\d{4}$/.test(value)) {
                error = 'Format: (XXX) XXX-XXXX';
            }
            break;
        case 'insuranceProvider':
        case 'physicianName':
        case 'pharmacyName':
            if (value && !/^[A-Za-z\s]*$/.test(value)) {
                error = 'Letters and spaces only';
            }
            break;
        case 'policyNumber':
            if (value && !/^[A-Za-z0-9]*$/.test(value)) {
                error = 'Alphanumeric characters only';
            }
            break;
        case 'desiredUserID':
            if (value && !/^[A-Za-z_\-][A-Za-z0-9_\-]{4,29}$/.test(value)) {
                error = '5-30 characters, letters, numbers, underscore, dash - first character cannot be a number';
            }
            break;
        case 'password':
            if (value) {
                const userId = getFieldValue('desiredUserID');
                const firstName = getFieldValue('firstName');
                const lastName = getFieldValue('lastName');
                const passwordErrors = validatePassword(value, userId, firstName, lastName);
                if (passwordErrors.length > 0) {
                    error = passwordErrors.join('; ');
                }
            }
            break;
        case 'confirmPassword':
            if (value) {
                const password = getFieldValue('password');
                if (value !== password) {
                    error = 'Passwords do not match';
                }
            }
            break;
    }

    return error;
}

// Add or update error message display
function showFieldError(fieldName, errorMessage) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return;

    // Only show error if field has been touched or validateAllFieldsNow was called
    if (!fieldTouched[fieldName] && !fieldTouched['__validateAll__']) {
        return;
    }

    // Find or create error message element
    let errorElement = document.getElementById(`error-${fieldName}`);
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = `error-${fieldName}`;
        errorElement.className = 'field-error';

        // Insert error message after the field
        if (field.type === 'radio') {
            // For radio buttons, insert after the parent container
            const radioContainer = field.closest('td') || field.parentElement;
            radioContainer.appendChild(errorElement);
        } else {
            field.parentElement.appendChild(errorElement);
        }
    }

    if (errorMessage) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
        field.classList.add('has-error');
        validationErrors[fieldName] = errorMessage;
    } else {
        errorElement.style.display = 'none';
        field.classList.remove('has-error');
        delete validationErrors[fieldName];
    }

    updateErrorCounter();
}

// Add real-time validation to a field
function addRealtimeValidation(fieldName) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return;

    if (field.type === 'radio') {
        // For radio buttons, add listener to all with same name
        const radioButtons = document.querySelectorAll(`[name="${fieldName}"]`);
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                fieldTouched[fieldName] = true; // Mark as touched
                const value = getFieldValue(fieldName);
                const error = validateSingleField(fieldName, value);
                showFieldError(fieldName, error);
            });
        });
    } else if (field.type === 'checkbox') {
        field.addEventListener('change', function() {
            fieldTouched[fieldName] = true; // Mark as touched
            const value = getFieldValue(fieldName);
            const error = validateSingleField(fieldName, value);
            showFieldError(fieldName, error);
        });
    } else {
        field.addEventListener('input', function() {
            fieldTouched[fieldName] = true; // Mark as touched
            const value = getFieldValue(fieldName);
            const error = validateSingleField(fieldName, value);
            showFieldError(fieldName, error);
        });

        field.addEventListener('blur', function() {
            fieldTouched[fieldName] = true; // Mark as touched
            const value = getFieldValue(fieldName);
            const error = validateSingleField(fieldName, value);
            showFieldError(fieldName, error);
        });
    }
}

// Validate all fields (called by Validate button)
function validateAllFieldsNow() {
    // Mark that validate all was called
    fieldTouched['__validateAll__'] = true;

    const fields = ['firstName', 'middleInitial', 'lastName', 'dateOfBirth', 'socialSecurity',
                   'gender', 'addressLine1', 'addressLine2', 'city', 'state', 'zipCode',
                   'emailAddress', 'phoneNumber', 'emergencyContact', 'emergencyPhone',
                   'isVaccinated', 'hasInsurance', 'desiredUserID', 'password', 'confirmPassword'];

    // Mark all fields as touched
    fields.forEach(fieldName => {
        fieldTouched[fieldName] = true;
    });

    fields.forEach(fieldName => {
        const value = getFieldValue(fieldName);
        const error = validateSingleField(fieldName, value);
        showFieldError(fieldName, error);
    });

    // Scroll to first error if any
    const firstErrorField = Object.keys(validationErrors)[0];
    if (firstErrorField) {
        const field = document.querySelector(`[name="${firstErrorField}"]`);
        if (field) {
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
            field.focus();
        }
    }
}

// Initialize on page load
function initializeForm() {
    setDateLimits();
    convertUserIDToLowercase();
    convertEmailToLowercase();

    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', validateForm);
    }

    // Add real-time validation to all fields
    const fields = ['firstName', 'middleInitial', 'lastName', 'dateOfBirth', 'socialSecurity',
                   'gender', 'addressLine1', 'addressLine2', 'city', 'state', 'zipCode',
                   'emailAddress', 'phoneNumber', 'emergencyContact', 'emergencyPhone',
                   'isVaccinated', 'hasInsurance', 'desiredUserID', 'password', 'confirmPassword'];

    fields.forEach(fieldName => {
        addRealtimeValidation(fieldName);
    });

    // Initialize error counter display
    const counterElement = document.getElementById('errorCounter');
    if (counterElement) {
        counterElement.textContent = 'Fill out the form and click VALIDATE to check for errors';
    }

    // Hide submit button initially
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.style.display = 'none';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeForm);
} else {
    initializeForm();
}
