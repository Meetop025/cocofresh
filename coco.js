// google-sheets.js - Backend to save to Google Sheets

const scriptURL = 'https://docs.google.com/spreadsheets/d/1a19f4CgsgA_c-DLTmo1kIpcM9FAJjCmVk80J42hhhSI/edit?usp=sharing';

function saveToDatabase(email, source = 'landing-page') {
    return fetch(scriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            source: source,
            timestamp: new Date().toISOString()
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            return { success: true, message: 'Saved successfully!' };
        } else {
            throw new Error(data.error || 'Failed to save');
        }
    })
    .catch(error => {
        console.error('Error saving to database:', error);
        return { success: false, message: error.message };
    });
}
