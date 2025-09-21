// Force offline mode for the deforestation detection app
(function() {
    console.log('🌐 Forcing offline mode with mock API');
    
    // Set offline mode flag
    localStorage.setItem('use-mock-api', 'true');
    localStorage.setItem('offline-mode', 'true');
    
    // Override fetch to prevent network calls
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (url.includes('localhost:8000') || url.includes('/predict') || url.includes('/model/status')) {
            console.log('🚫 Blocking network request to:', url);
            return Promise.reject(new Error('Network request blocked - using mock API'));
        }
        return originalFetch.apply(this, arguments);
    };
    
    console.log('✅ Offline mode activated - all AI requests will use mock API');
})();
