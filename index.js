const API_BASE = 'https://comp4537-lab5-14co.onrender.com/lab5/api/v1/sql';
const response = document.getElementById('response');



// Function to load strings
async function loadStrings() {
    const stringData = await fetch('en.json');
    const strings = await stringData.json();
    document.title = strings.index.title;
    document.getElementById('index_heading').innerText = strings.index.heading;
    document.getElementById('insert_sample').innerText = strings.index.sampleButton;
    document.getElementById('query').placeholder = strings.index.queryAreaPlaceholder;
    document.getElementById('send_query').innerText = strings.index.sendQueryButton;
    document.getElementById('server_response_heading').innerText = strings.index.serverResponseHeading;
}

// Function to insert sample data
document.getElementById('insert_sample').addEventListener('click', async () => {
    let data;

    const sql = `
        INSERT into patient (name, dateOfBirth)
        VALUES
            ('Sara Brown', '1901-01-01'),
            ('John Smith', 1941-01-01'),
            ('Jack Ma', '1961-01-30'),
            ('Elon Musk', '1999-01-01')
    `;

    try {
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: sql })
        });

        data = await res.json();
        response.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
        response.textContent = JSON.stringify(err.message, null, 2);
    }
});

// Function to send query
document.getElementById('send_query').addEventListener('click', async () => {
   
    const data = await fetch('en.json');
    const strings = await data.json();
    
    const sql = document.getElementById('query').value.trim();
    try {
        let res, data;

        if (!sql) {
            response.textContent = strings.index.missingQuery;
            return;
     }

        const lower = sql.toLowerCase();

        if (lower.startsWith('select')) {
            const encodedSQL = encodeURIComponent(sql);
            res = await fetch(`${API_BASE}?query=${encodedSQL}`, { method: "GET" });
        } else if (lower.startsWith('insert')) {
            res = await fetch(API_BASE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ sql })
            });
        } else {
            response.textContent = strings.index.invalidQuery;
            return;
        }

        data = await res.json();
        response.textContent = JSON.stringify(data, null, 2);
    } catch (err){
        response.textContent = JSON.stringify(err.message, null, 2);
    }
});

loadStrings();
