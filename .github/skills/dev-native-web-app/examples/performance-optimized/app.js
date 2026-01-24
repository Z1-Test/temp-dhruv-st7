// Performance-optimized JavaScript
// Demonstrates best practices for INP optimization

// === Avoid Long Tasks ===
// Break up large operations using requestIdleCallback or setTimeout

function processLargeDataset(data, chunkSize = 100) {
  return new Promise((resolve) => {
    const results = [];
    let index = 0;
    
    function processChunk() {
      const chunk = data.slice(index, index + chunkSize);
      
      for (const item of chunk) {
        // Process each item
        results.push(item * 2); // Example operation
      }
      
      index += chunkSize;
      
      if (index < data.length) {
        // Yield to the main thread between chunks
        if ('scheduler' in window && 'yield' in window.scheduler) {
          window.scheduler.yield().then(processChunk);
        } else {
          setTimeout(processChunk, 0);
        }
      } else {
        resolve(results);
      }
    }
    
    processChunk();
  });
}

// === Use requestIdleCallback for non-critical work ===
function scheduleNonCriticalWork(callback) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout: 2000 });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(callback, 100);
  }
}

// === Debounce for input handlers ===
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// === Throttle for scroll/resize handlers ===
function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// === Example: Optimized scroll handler ===
const handleScroll = throttle(() => {
  console.log('Scroll handled efficiently');
}, 100);

// === Example: Optimized search input ===
const handleSearch = debounce((query) => {
  console.log('Searching for:', query);
  // Perform search operation
}, 300);

// === Lazy load non-critical features ===
async function loadAnalytics() {
  // Only load analytics when the page is idle
  scheduleNonCriticalWork(async () => {
    // Dynamically import analytics module
    // const analytics = await import('./analytics.js');
    // analytics.init();
    console.log('Analytics loaded during idle time');
  });
}

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
  // Attach optimized event handlers
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Load non-critical features during idle
  loadAnalytics();
  
  console.log('Performance-optimized page initialized');
});

// === Measure performance ===
if ('PerformanceObserver' in window) {
  // Observe LCP
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime.toFixed(2), 'ms');
  });
  lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  
  // Observe CLS
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    console.log('CLS:', clsValue.toFixed(4));
  });
  clsObserver.observe({ type: 'layout-shift', buffered: true });
}
