const fetch = require('node-fetch');

async function testCategoryRelevance() {
  try {
    console.log('Testing category relevance for query: "¿Qué cortacésped me recomiendas para un jardín húmedo?"');
    
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: '¿Qué cortacésped me recomiendas para un jardín húmedo?',
        location: 'Castilla y León',
        month: 3,
        weather: {
          condition: 'nublado',
          temperature: 15,
          humidity: 60,
          windSpeed: 10
        }
      })
    });
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testCategoryRelevance(); 