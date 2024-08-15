document.getElementById('searchBtn').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value;
    if (query) {
        searchApplication(query);
    }
});

document.getElementById('updateStatusBtn').addEventListener('click', function() {
    const newStatus = document.getElementById('statusSelect').value;
    const applicationNumber = document.getElementById('result').dataset.applicationNumber;
    updateStatus(applicationNumber, newStatus);
});

document.getElementById('backToSearchBtn').addEventListener('click', function() {
    showScreen('screen1');
});

function searchApplication(query) {
    showLoader(true);

    fetch(`https://0-157-0.app.nr.it.loc/id?id=${encodeURIComponent(query)}`)
        .then(response => {
            showLoader(false);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.applicationNumber) {
                displayResult(data);
                updateStatusOptions(data.status);
                showScreen('screen2');
            } else {
                alert('Заявка не знайдеа');
            }
        })
        .catch(error => {
            showLoader(false);
            alert('Помилка при виконанні пошуку: ' + error.message);
        });
}

function displayResult(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <p>ІПН: ${data.fullName}</p>
        <p>Номер заявки: ${data.applicationNumber}</p>
        <p>Теперішній статус: ${data.status}</p>
    `;
    resultDiv.dataset.applicationNumber = data.applicationNumber;
}

function updateStatusOptions(currentStatus) {
    const statusSelect = document.getElementById('statusSelect');
    statusSelect.innerHTML = ''; // Очищаем предыдущие опции

    let options = [];

    switch (currentStatus) {
        case '7':
        case '58':
            options = [
                { value: '20', text: 'Статус 20' },
                { value: '15', text: 'Статус 15' }
            ];
            break;
        case '15':
            options = [
                { value: '15', text: 'Статус 15' },
                { value: '20', text: 'Статус 20' }
            ];
            break;
        case '6':
        case '20':
            options = [
                { value: '21', text: 'Статус 21' },
                { value: '15', text: 'Статус 15' }
            ];
            break;
        default:
            options = [
                { value: '', text: 'Зміна статусу неможлива', disabled: true }
            ];
            break;
    }

    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.text = option.text;
        if (option.disabled) {
            opt.disabled = true;
        }
        statusSelect.add(opt);
    });
}

function updateStatus(applicationNumber, newStatus) {
    showLoader(true);

    fetch('https://0-157-0.app.nr.it.loc/updateStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            applicationNumber: applicationNumber,
            newStatus: newStatus
        })
    })
    .then(response => {
        showLoader(false);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showScreen('successScreen');
        } else {
            console.log(data)
            alert('Помилка при зміні статуса: ' + data.message);
        }
    })
    .catch(error => {
        showLoader(false);
        alert('Помилка при зміні статуса: ' + error.message);
    });
}

function showLoader(show) {
    const loader = document.getElementById('loader');
    loader.classList.toggle('hidden', !show);
}

function showScreen(screenId) {
    document.getElementById('screen1').classList.add('hidden');
    document.getElementById('screen2').classList.add('hidden');
    document.getElementById('successScreen').classList.add('hidden');
    document.getElementById(screenId).classList.remove('hidden');
}
