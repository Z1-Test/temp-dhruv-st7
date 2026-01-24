// Internationalization (i18n) Examples using the Intl API

// Current date for examples
const now = new Date();
const sampleNumber = 1234567.89;
const sampleCurrency = 49999.99;

// Locales to demonstrate
const locales = ['en-US', 'ar-SA', 'he-IL', 'ja-JP', 'de-DE', 'fr-FR'];

// === Date Formatting ===
function formatDates() {
  const container = document.getElementById('date-examples');
  if (!container) return;
  
  locales.forEach((locale) => {
    const formatter = new Intl.DateTimeFormat(locale, {
      dateStyle: 'full',
      timeStyle: 'short'
    });
    
    const li = document.createElement('li');
    li.innerHTML = `<strong>${locale}:</strong> ${formatter.format(now)}`;
    container.appendChild(li);
  });
}

// === Number Formatting ===
function formatNumbers() {
  const container = document.getElementById('number-examples');
  if (!container) return;
  
  locales.forEach((locale) => {
    const formatter = new Intl.NumberFormat(locale);
    
    const li = document.createElement('li');
    li.innerHTML = `<strong>${locale}:</strong> ${formatter.format(sampleNumber)}`;
    container.appendChild(li);
  });
}

// === Currency Formatting ===
function formatCurrency() {
  const container = document.getElementById('currency-examples');
  if (!container) return;
  
  const currencies = [
    { locale: 'en-US', currency: 'USD' },
    { locale: 'ar-SA', currency: 'SAR' },
    { locale: 'he-IL', currency: 'ILS' },
    { locale: 'ja-JP', currency: 'JPY' },
    { locale: 'de-DE', currency: 'EUR' },
    { locale: 'en-GB', currency: 'GBP' }
  ];
  
  currencies.forEach(({ locale, currency }) => {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    });
    
    const li = document.createElement('li');
    li.innerHTML = `<strong>${locale} (${currency}):</strong> ${formatter.format(sampleCurrency)}`;
    container.appendChild(li);
  });
}

// === Relative Time Formatting ===
function formatRelativeTime() {
  const container = document.getElementById('relative-examples');
  if (!container) return;
  
  const examples = [
    { value: -1, unit: 'day' },
    { value: 2, unit: 'hour' },
    { value: -3, unit: 'week' },
    { value: 1, unit: 'month' }
  ];
  
  ['en-US', 'ar-SA', 'ja-JP'].forEach((locale) => {
    const formatter = new Intl.RelativeTimeFormat(locale, { 
      numeric: 'auto',
      style: 'long'
    });
    
    const formatted = examples
      .map(({ value, unit }) => formatter.format(value, unit))
      .join(', ');
    
    const li = document.createElement('li');
    li.innerHTML = `<strong>${locale}:</strong> ${formatted}`;
    container.appendChild(li);
  });
}

// === Language Switcher ===
function switchLanguage(locale) {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  const isRTL = rtlLanguages.includes(locale);
  
  // Update html attributes
  document.documentElement.lang = locale;
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  
  console.log(`Switched to ${locale}, RTL: ${isRTL}`);
}

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
  formatDates();
  formatNumbers();
  formatCurrency();
  formatRelativeTime();
  
  // Set current year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Detect user's preferred language
  const userLang = navigator.language || navigator.userLanguage;
  console.log('User preferred language:', userLang);
});
