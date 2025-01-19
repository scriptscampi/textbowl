const structuredData = {
  "@context": "https://schema.org",
  "@type": "Game",
  "name": "Text Bowl Football Game",
  "description": "A retro-style text-based football simulator. Make plays, score touchdowns, and relive football history!",
  "genre": ["Sports", "Simulation"],
  "publisher": {
    "@type": "Organization",
    "name": "ScriptScampi",
    "url": "https://textbowl.com"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://textbowl.com",
    "price": "0.00",
    "priceCurrency": "USD",
  },
 

// Append JSON-LD script to the head
const script = document.createElement('script');
script.type = 'application/ld+json';
script.text = JSON.stringify(structuredData);
document.head.appendChild(script);
