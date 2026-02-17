const form = document.getElementById('search-form');
const input = document.getElementById('word-input');
const result = document.getElementById('result');

function showMessage(text, isError = false) {
  result.innerHTML = `<p class="message ${isError ? 'error' : ''}">${text}</p>`;
}

function renderEntry(entry) {
  const meanings = (entry.meanings || []).slice(0, 3);

  const meaningsHtml = meanings
    .map((meaning) => {
      const definitions = (meaning.definitions || [])
        .slice(0, 3)
        .map((item) => `<li>${item.definition}</li>`)
        .join('');

      if (!definitions) return '';

      return `
        <h3 class="part">${meaning.partOfSpeech}</h3>
        <ol class="definition-list">${definitions}</ol>
      `;
    })
    .join('');

  result.innerHTML = `
    <h2 class="word">${entry.word}</h2>
    <p class="phonetic">${entry.phonetic || 'No phonetic available'}</p>
    ${meaningsHtml || '<p class="message">No definitions found.</p>'}
  `;
}

async function searchWord(word) {
  showMessage('Searching...');

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

    if (!response.ok) {
      throw new Error('Word not found. Please try another one.');
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No result found.');
    }

    renderEntry(data[0]);
  } catch (error) {
    showMessage(error.message || 'Something went wrong. Please try again.', true);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const word = input.value.trim();

  if (!word) {
    showMessage('Please enter a word.', true);
    return;
  }

  searchWord(word);
});
