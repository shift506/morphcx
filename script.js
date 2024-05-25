document.addEventListener("DOMContentLoaded", function() {
    const apiKey = '107428557849904226832';
    const spreadsheetId = 'https://docs.google.com/spreadsheets/d/1rBua1qewXNcV2Ige29jhvC5qdLtBfDQSKBuGJaqEfsg/edit#gid=241407808';
    const range = 'Questions!A:D';

    function loadQuestions() {
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        }).then((response) => {
            const questions = response.result.values;
            displayQuestions(questions);
        }, (response) => {
            console.log('Error: ' + response.result.error.message);
        });
    }

    function displayQuestions(questions) {
        const container = document.getElementById('questions-container');
        questions.forEach((question, index) => {
            const questionId = `q${index + 1}`;
            const questionText = question[1];
            const options = question.slice(2);

            const questionContainer = document.createElement('div');
            questionContainer.classList.add('question-container');

            const title = document.createElement('p');
            title.classList.add('question-title');
            title.textContent = `${index + 1}. ${questionText}`;
            questionContainer.appendChild(title);

            options.forEach((option, i) => {
                const label = document.createElement('label');
                label.textContent = option;
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = questionId;
                input.value = i + 1;
                questionContainer.appendChild(input);
                questionContainer.appendChild(label);
                questionContainer.appendChild(document.createElement('br'));
            });

            container.appendChild(questionContainer);
        });
    }

    function submitAssessment() {
        const form = document.getElementById('assessment-form');
        const formData = new FormData(form);
        let score = 0;
        for (let value of formData.values()) {
            score += parseInt(value);
        }
        let level, definition, recommendation;
        if (score <= 19) {
            level = 'Level 1: Limited CX';
            definition = 'At this level, the organization has basic CX capabilities.';
            recommendation = 'Conduct a CX maturity assessment to understand gaps and opportunities.';
        } else if (score <= 30) {
            level = 'Level 2: Emerging CX';
            definition = 'At this level, the organization is starting to develop CX capabilities.';
            recommendation = 'Standardize CX practices across the organization.';
        } else if (score <= 40) {
            level = 'Level 3: Evolving CX';
            definition = 'At this level, the organization has a clear CX strategy.';
            recommendation = 'Ensure CX is integrated into all processes and services.';
        } else if (score <= 50) {
            level = 'Level 4: Mature CX';
            definition = 'At this level, the organization has advanced CX capabilities.';
            recommendation = 'Foster a culture of continuous improvement.';
        } else {
            level = 'Level 5: Leading CX';
            definition = 'At this level, the organization is a leader in CX.';
            recommendation = 'Encourage employees at all levels to seek out CX excellence.';
        }
        document.getElementById('result').innerHTML = 
            `<h2>Your Maturity Level</h2>
             <p><strong>Level:</strong> ${level}</p>
             <p><strong>Definition:</strong> ${definition}</p>
             <p><strong>Recommendation:</strong> ${recommendation}</p>`;
    }

    gapi.load('client', () => {
        gapi.client.init({
            'apiKey': apiKey,
        }).then(() => {
            loadQuestions();
        });
    });
});
