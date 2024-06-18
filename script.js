

















// Formatowanie imienia: pierwsza litera każdego słowa duża, reszta mała
function formatName(name) {
    return name.toLowerCase().replace(/\b\w/g, function(char) {
        return char.toUpperCase();
    });
}
// Obsługa zdarzenia po załadowaniu DOM
document.addEventListener('DOMContentLoaded', function() {
    loadEntries();

    // Obsługa formularza dodawania/edycji wpisu
    document.getElementById('dataForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const info = document.getElementById('info').value.trim();
        const note = document.getElementById('note').value.trim();
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const phone = document.getElementById('phone').value.trim();
        const created = new Date();
        const formattedCreated = `${created.toLocaleDateString('pl-PL')} ${created.toLocaleTimeString('pl-PL')}`;

        // Dodanie obsługi zdjęcia
        const photoInput = document.getElementById('photo');
        let photo = '';

        if (photoInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(event) {
                photo = event.target.result;

                // Po załadowaniu zdjęcia, kontynuuj zapisywanie danych
                saveEntryWithData(name, info, note, date, time, phone, formattedCreated, photo);
            };
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            // Jeśli nie ma wybranego zdjęcia, kontynuuj bez zdjęcia
            saveEntryWithData(name, info, note, date, time, phone, formattedCreated, photo);
        }
    });

    // Funkcja pomocnicza do zapisu danych wpisu (zawiera obsługę zdjęcia)
    function saveEntryWithData(name, info, note, date, time, phone, formattedCreated, photo) {
        let entries = JSON.parse(localStorage.getItem('entries')) || [];
        let existingEntry = entries.find(entry => entry.name === name);

        if (existingEntry) {
            existingEntry.info = info;
            existingEntry.date = date;
            existingEntry.time = time;
            existingEntry.phone = phone;
            existingEntry.created = existingEntry.created || formattedCreated;
            existingEntry.photo = photo; // Dodaj zdjęcie do istniejącego wpisu

            if (note) {
                existingEntry.notes = existingEntry.notes || [];
                const newNote = {
                    note: note,
                    created: formattedCreated
                };
                existingEntry.notes.push(newNote);
            }
        } else {
            if (name) {
                const newEntry = {
                    name: name,
                    info: info,
                    date: date,
                    time: time,
                    phone: phone,
                    created: formattedCreated,
                    notes: [],
                    photo: photo // Dodaj zdjęcie do nowego wpisu
                };
                if (note) {
                    const newNote = {
                        note: note,
                        created: formattedCreated
                    };
                    newEntry.notes.push(newNote);
                }
                entries.push(newEntry);
            } else {
                alert('Wprowadź imię i nazwisko!');
                return;
            }
        }

        localStorage.setItem('entries', JSON.stringify(entries));
        saveEntriesToFile(entries);
        alert('Dane zostały zapisane/edytowane!');
        document.getElementById('dataForm').reset();
        searchData();
        scrollToTop();
    };
    document.getElementById('search').addEventListener('input', searchData);
})
function resizeImage(file, maxWidth, maxHeight, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const dataUrl = canvas.toDataURL('image/jpeg'); // Możesz ustawić format, który Ci odpowiada

            callback(dataUrl);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}
// Funkcja wczytująca wpisy z lokalnego API
function loadEntries() {
    fetch('/api/entries')
        .then(response => response.json())
        .then(entries => {
            localStorage.setItem('entries', JSON.stringify(entries));
            searchData();
        })
        .catch(error => console.error('Error loading entries:', error));
}
// Funkcja zapisująca wpisy do pliku za pośrednictwem API
function saveEntriesToFile(entries) {
    fetch('/api/entries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(entries)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error saving entries');
        }
    })
    .catch(error => console.error('Error saving entries:', error));
}
// Funkcja przeprowadzająca wyszukiwanie
function searchData() {
    const search = document.getElementById('search').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    let results = entries.filter(entry => 
        formatName(entry.name).toLowerCase().includes(search) ||
        (entry.phone && entry.phone.toLowerCase().includes(search))
    );

    if (results.length > 0) {
        results.forEach(result => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result-item';
            resultDiv.innerHTML = `
                <div>
            
                    <strong>Imię i nazwisko:</strong> ${formatName(result.name)}<br>
                    <strong>Telefon:</strong> ${result.phone ? result.phone : 'Brak'}<br>
                    <strong>Dodatkowe informacje:</strong><br>${result.info ? result.info.replace(/\n/g, '<br>') : 'Brak dodatkowych informacji'}<br>
                    <strong>Notatki:</strong><br>
                    ${renderNotes(result.notes)}<br>
                    <strong>Data:</strong> ${result.date}<br>   
                    <strong>Godzina:</strong> ${result.time}<br>
                    <strong>Utworzono:</strong> ${result.created}<br>
                      ${result.photo ? `<img src="${result.photo}">`:``}
                    <button onclick="editEntry('${result.name}')">Edytuj</button>
                    <button onclick="deleteEntry('${result.name}')">Usuń</button>
                </div>
                <hr>
            `;
            resultsDiv.appendChild(resultDiv);
        });
    } else {
        resultsDiv.innerHTML = '<p>Brak wyników.</p>';
    }
}
// Funkcja renderująca notatki
function renderNotes(notes) {
    if (!notes || notes.length === 0) {
        return 'Brak notatek';
    }

    let notesHtml = '';
    notes.forEach((note, index) => {
        notesHtml += `
            <div class="note-item">
                <strong>Notatka ${index + 1}:</strong> ${note.note}<br>
                <strong>Utworzono:</strong> ${note.created}<br>
                <button onclick="editNote('${note.created}')">Edytuj notatkę</button>
                <button onclick="deleteNote('${note.created}')">Usuń notatkę</button>
            </div>
        `;
    });

    return notesHtml;
}
function editEntry(name) {
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    let entry = entries.find(entry => entry.name === name);

    if (entry) {
        document.getElementById('name').value = entry.name;
        document.getElementById('info').value = entry.info;
        document.getElementById('date').value = entry.date;
        document.getElementById('time').value = entry.time;
        document.getElementById('phone').value = entry.phone ? entry.phone : ''; // Clear the phone input if no phone number
        document.getElementById('note').value = ''; // Clear the note input
        document.getElementById('note').focus(); // Focus on note input
    } else {
        alert('Nie znaleziono wpisu do edycji.');
    }
}
function editNote(created) {
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.forEach(entry => {
        if (entry.notes) {
            let noteIndex = entry.notes.findIndex(note => note.created === created);
            if (noteIndex !== -1) {
                let newNote = prompt('Edytuj notatkę:', entry.notes[noteIndex].note);
                if (newNote !== null) {
                    entry.notes[noteIndex].note = newNote;
                    entry.notes[noteIndex].created = new Date().toLocaleDateString('pl-PL') + ' ' + new Date().toLocaleTimeString('pl-PL');
                    localStorage.setItem('entries', JSON.stringify(entries));
                    saveEntriesToFile(entries);
                    alert('Notatka została zaktualizowana.');
                    searchData();
                }
            }
        }
    });
}
// Funkcja usuwająca wpis
function deleteEntry(name) {
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    let updatedEntries = entries.filter(entry => entry.name !== name);

    localStorage.setItem('entries', JSON.stringify(updatedEntries));
    saveEntriesToFile(updatedEntries);
    alert('Wpis został usunięty.');
    searchData();
}
// Funkcja usuwająca notatkę
function deleteNote(created) {
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.forEach(entry => {
        if (entry.notes) {
            let initialLength = entry.notes.length;
            entry.notes = entry.notes.filter(note => note.created !== created);
            if (entry.notes.length < initialLength) {
                localStorage.setItem('entries', JSON.stringify(entries));
                saveEntriesToFile(entries);
                alert('Notatka została usunięta.');
                searchData();
            }
        }
    });
}
// Funkcja przewijająca do góry strony
function scrollToTop() {
    window.scrollTo(0, 0);
}
