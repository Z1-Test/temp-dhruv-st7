// Accessible Form Validation
// WCAG 2.2 AA Compliant with focus management and error announcements

const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const errorSummary = document.getElementById('error-summary');
const errorList = document.getElementById('error-list');

// Validation rules
const validators = {
  name: {
    validate: (value) => value.trim().length >= 2,
    message: 'Please enter your full name (at least 2 characters)'
  },
  email: {
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  },
  subject: {
    validate: () => form.querySelector('input[name="subject"]:checked'),
    message: 'Please select a subject'
  },
  message: {
    validate: (value) => value.trim().length >= 20,
    message: 'Please enter a message (at least 20 characters)'
  },
  consent: {
    validate: () => form.consent.checked,
    message: 'Please agree to the Privacy Policy'
  }
};

// Form submission handler
form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const errors = validateForm();
  
  if (errors.length > 0) {
    showErrors(errors);
    // Move focus to error summary
    errorSummary.focus();
    // Announce to screen readers
    formStatus.textContent = `Form has ${errors.length} error${errors.length > 1 ? 's' : ''}. Please review.`;
  } else {
    hideErrors();
    formStatus.textContent = 'Form submitted successfully!';
    // Here you would submit the form data
    console.log('Form submitted:', new FormData(form));
  }
});

// Validate all fields
function validateForm() {
  const errors = [];
  
  for (const [fieldName, validator] of Object.entries(validators)) {
    const field = form[fieldName];
    const value = field?.value || '';
    
    if (!validator.validate(value)) {
      errors.push({
        field: fieldName,
        message: validator.message
      });
      setFieldError(fieldName, validator.message);
    } else {
      clearFieldError(fieldName);
    }
  }
  
  return errors;
}

// Set error on individual field
function setFieldError(fieldName, message) {
  const field = form[fieldName];
  const errorElement = document.getElementById(`${fieldName}-error`);
  
  if (field && field.setAttribute) {
    field.setAttribute('aria-invalid', 'true');
  }
  
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.hidden = false;
  }
}

// Clear error on individual field
function clearFieldError(fieldName) {
  const field = form[fieldName];
  const errorElement = document.getElementById(`${fieldName}-error`);
  
  if (field && field.removeAttribute) {
    field.removeAttribute('aria-invalid');
  }
  
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.hidden = true;
  }
}

// Show error summary
function showErrors(errors) {
  errorList.innerHTML = '';
  
  errors.forEach(({ field, message }) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${field}`;
    link.textContent = message;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetField = document.getElementById(field) || 
                          document.querySelector(`input[name="${field}"]`);
      targetField?.focus();
    });
    li.appendChild(link);
    errorList.appendChild(li);
  });
  
  errorSummary.hidden = false;
  errorSummary.setAttribute('tabindex', '-1');
}

// Hide error summary
function hideErrors() {
  errorSummary.hidden = true;
  errorList.innerHTML = '';
}

// Real-time validation on blur
form.querySelectorAll('input, textarea').forEach((field) => {
  field.addEventListener('blur', () => {
    const fieldName = field.name;
    const validator = validators[fieldName];
    
    if (validator) {
      const value = field.value || '';
      if (value && !validator.validate(value)) {
        setFieldError(fieldName, validator.message);
      } else if (value) {
        clearFieldError(fieldName);
      }
    }
  });
});
