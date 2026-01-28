// Test API Connection
// Run this in browser console to test the API

async function testAPI() {
  console.log('🔍 Testing API Connection...');
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api');

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@youshop.com',
        password: 'password123'
      })
    });

    console.log('✅ Response Status:', response.status);
    console.log('✅ Response Headers:', [...response.headers.entries()]);

    const data = await response.json();
    console.log('✅ Response Data:', data);

    return data;
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('❌ Error Type:', error.constructor.name);
    console.error('❌ Error Message:', error.message);

    // Check if it's a CORS error
    if (error.message.includes('fetch')) {
      console.error('🚨 This looks like a CORS error!');
      console.error('📝 Solution: Add CORS configuration to your NestJS backend');
    }

    return null;
  }
}

// Run the test
testAPI();
