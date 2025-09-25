// google-sheets.js - Backend to save to Google Sheets

const scriptURL = 'https://docs.google.com/spreadsheets/d/1WWsk8NGLJlDQxsBf3nJOkrcGdrlU4_wt-0ZYKgc75yE/edit?gid=0#gid=0';

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