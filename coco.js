// google-sheets.js - Backend to save to Google Sheets

const scriptURL = 'https://script.google.com/macros/s/AKfycbyVtyPTRyznzcf06DdmNbsgIxPeFIidUFtCVf4ZyIlR0yHk5kvqjVHAaR_1lvfrEGhiJA/exec';

document.getElementById('waitlistForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // ... your code to get the email value ...

    fetch(SCRIPT_URL, { // This function uses the URL you just set
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response
    });
});
