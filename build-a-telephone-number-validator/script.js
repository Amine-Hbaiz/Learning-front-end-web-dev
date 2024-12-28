document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const checkBtn = document.getElementById('check-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultsDiv = document.getElementById('results-div');

    const validatePhoneNumber = (number) => {
        // Remove all whitespace first to help with validation
        const cleanNumber = number.trim();
        
        // Return false for empty input
        if (!cleanNumber) {
            alert('Please provide a phone number');
            return;
        }

        // Regular expression to match valid US phone number formats
        const phoneRegex = /^(1\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/;

        // Test if the number matches the regex pattern
        const isValid = phoneRegex.test(cleanNumber);

        // Additional validation for country code if present
        if (cleanNumber.startsWith('2') || 
            cleanNumber.startsWith('0') || 
            cleanNumber.startsWith('-') ||
            cleanNumber.startsWith('11') ||
            cleanNumber.startsWith('10')) {
            displayResult(`Invalid US number: ${number}`, false);
            return;
        }

        // Display the result
        displayResult(`${isValid ? 'Valid' : 'Invalid'} US number: ${number}`, isValid);
    };

    const displayResult = (message, isValid) => {
        resultsDiv.textContent = message;
        resultsDiv.className = isValid ? 'valid' : 'invalid';
    };

    const clearResults = () => {
        userInput.value = '';
        resultsDiv.textContent = '';
        resultsDiv.className = '';
    };

    // Event Listeners
    checkBtn.addEventListener('click', () => {
        validatePhoneNumber(userInput.value);
    });

    clearBtn.addEventListener('click', clearResults);

    // Allow validation with Enter key
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            validatePhoneNumber(userInput.value);
        }
    });
});
