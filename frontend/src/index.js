import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #0f1117; color: #e2e8f0; }
  input, select { background: #1e2433 !important; color: #e2e8f0 !important; }
  input::placeholder { color: #4a5568 !important; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #1a1f2e; }
  ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 3px; }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);