import '@testing-library/jest-dom'

// Mock scrollIntoView for jsdom
HTMLElement.prototype.scrollIntoView = function() {};
