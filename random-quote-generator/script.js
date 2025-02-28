const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
const getRandomItem = array => array[Math.floor(Math.random() * array.length)];
const QUOTES_API_URL = 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json';

const state = { quotes: [], currentQuote: null, randomColor: randomColor() };
const elements = {
  quoteText: document.querySelector('#text'),
  quoteAuthor: document.querySelector('#author'),
  newQuoteButton: document.querySelector('#new-quote'),
  tweetQuoteLink: document.querySelector('#tweet-quote'),
  tumblrQuoteLink: document.querySelector('#tumblr-quote'),
  buttons: document.querySelectorAll('.button')
};

const fetchQuotes = async () => {
  try {
    const response = await fetch(QUOTES_API_URL);
    if (!response.ok) throw new Error();
    return (await response.json()).quotes;
  } catch {
    return [{ quote: 'Failed to load quotes. Please try again later.', author: 'System' }];
  }
};

const updateSocialLinks = (quote, author) => {
  const encodedQuote = encodeURIComponent(`"${quote}" ${author}`);
  elements.tweetQuoteLink.href = `https://twitter.com/intent/tweet?hashtags=quotes&text=${encodedQuote}`;
  elements.tumblrQuoteLink.href = `https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes&caption=${encodeURIComponent(author)}&content=${encodeURIComponent(quote)}&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button`;
};

const updateQuoteDisplay = async (quote, author) => {
  elements.quoteText.textContent = quote;
  elements.quoteAuthor.textContent = author;
};

const getNewQuote = async () => {
  state.randomColor = randomColor();
  state.currentQuote = getRandomItem(state.quotes);
  await updateQuoteDisplay(state.currentQuote.quote, state.currentQuote.author);
  updateSocialLinks(state.currentQuote.quote, state.currentQuote.author);
  (function animateBackgroundColor(color) {
    document.body.style.transition = 'background-color 500ms, color 50ms';
    document.body.style.backgroundColor = color;
    document.body.style.color = color;
    elements.buttons.forEach(btn => (btn.style.backgroundColor = color));
  })(state.randomColor);
};

document.addEventListener('DOMContentLoaded', async () => {
  elements.newQuoteButton.disabled = true;
  state.quotes = await fetchQuotes();
  elements.newQuoteButton.disabled = false;
  elements.newQuoteButton.addEventListener('click', getNewQuote);
  await getNewQuote();
});