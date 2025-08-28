// Simple test script to verify the API route
// Run this with: node test-api.js

async function testAPI() {
  try {
    console.log('Testing API route...');
    
    // Test GET endpoint
    const getResponse = await fetch('http://localhost:3001/api/ai-analysis', {
      method: 'GET'
    });
    
    console.log('GET Response status:', getResponse.status);
    const getResult = await getResponse.json();
    console.log('GET Response:', getResult);
    
    // Test POST endpoint
    const postResponse = await fetch('http://localhost:3001/api/ai-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Hello, how are you?',
        model: 'gpt2',
        maxTokens: 50,
        temperature: 0.7,
        analysisType: 'single'
      }),
    });
    
    console.log('POST Response status:', postResponse.status);
    const postResult = await postResponse.json();
    console.log('POST Response:', postResult);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAPI();
