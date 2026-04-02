const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpCJSYEFM6GNtS6neFO7l_F697a9Hc8pat3rLGl5Uk2zFaxwlV1sBpY6rX27MIiQqqcmOy30bOIU12/pub?gid=349167318&single=true&output=csv';

const emojiMap = {
    "Science Fiction": "🪐", "History": "⌛️", "Memoir": "✍️", "Literature": "📜",
    "Fantasy": "🧙‍♂️", "Humor": "🤣", "Horror": "🧛‍♂️", "Biography": "🙋🏻‍♂️",
    "Politics": "⚖️", "Science": "🧬", "Government": "🏛️", "True Crime": "🕵️‍♂️",
    "Young Adult": "🖍️", "Historical Fiction": "⏳", "Dystopia": "⛓️‍💥", "Philosophy": "🤔",
    "Race": "✊🏽", "Sociology": "👥", "Social Justice": "📣", "Religion": "✝️",
    "Economics": "💰", "Psychology": "🧠", "Nature": "🌱", "Environment": "🌎",
    "Technology": "🛜", "Linguistics": "🗣️", "Art": "🖼️", "Music": "🎼",
    "Education": "🎓", "Classics": "🖋️", "Mythology": "🔱", "Folklore": "🧚‍♀️",
    "Adventure": "🧗‍♂️", "War": "⚔️", "Western": "🤠", "Thriller": "🔪",
    "Mystery": "🫆", "Crime": "🚔", "Magical Realism": "✨", "Contemporary": "📍",
    "Romance": "💋", "Poetry": "📝", "Drama": "🎭", "Self-Help": "👨‍🔧",
    "Short Stories": "📚", "Graphic Novel": "🦸‍♀️"
};

let allBooks = [];

// Initialize
async function init() {
    setupUIListeners();
    try {
        const response = await fetch(CSV_URL);
        const csvText = await response.text();
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                allBooks = results.data.filter(row => row.Title && row.Title !== "Totals & Averages");
                renderBooks(allBooks);
            }
        });
    } catch (e) {
        document.getElementById('book-list').innerHTML = "ERROR: ACCESS_DENIED";
    }
}

function renderBooks(books) {
    const container = document.getElementById('book-list');
    container.innerHTML = '';
    books.forEach(book => {
        const isRead = book.Read === 'Y';
        const categories = book.Category ? book.Category.split('|').map(c => c.trim()) : [];
        const icons = categories.map(cat => emojiMap[cat] || "📂").join(" ");

        const row = document.createElement('div');
        row.className = `book-row ${isRead ? 'decrypted' : 'locked'}`;
        row.innerHTML = `
            <div class="col-author">${book['Author (Last, First)'] || '---'}</div>
            <div class="col-title">${book.Title}</div>
            <div class="col-category">${icons} ${book.Category || ''}</div>
            <div class="col-status">${isRead ? 'DECRYPTED' : 'LOCKED'}</div>
        `;
        container.appendChild(row);
    });
}

function setupUIListeners() {
    const search = document.getElementById('search-input');
    const toggle = document.getElementById('filter-toggle');
    const close = document.getElementById('close-filters');
    const panel = document.getElementById('filter-panel');

    // Sidebar Toggle
    toggle.onclick = () => panel.classList.add('is-active');
    close.onclick = () => panel.classList.remove('is-active');

    // Search Logic
    search.oninput = () => {
        const query = search.value.toLowerCase();
        const filtered = allBooks.filter(b => 
            b.Title.toLowerCase().includes(query) || 
            b['Author (Last, First)'].toLowerCase().includes(query)
        );
        renderBooks(filtered);
    };

    // Rating Slider logic
    const ratingSlider = document.getElementById('filter-rating');
    ratingSlider.oninput = () => {
        document.getElementById('rating-val').innerText = ratingSlider.value;
        const filtered = allBooks.filter(b => parseFloat(b.Kyle || 0) >= parseFloat(ratingSlider.value));
        renderBooks(filtered);
    };
}

init();