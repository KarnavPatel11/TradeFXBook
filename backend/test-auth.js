const http = require('http');

const data = JSON.stringify({
  email: 'test7@test.com',
  password: 'Test1234!',
  name: 'Test',
  username: 'testuser7'
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  let body = '';
  console.log('Status:', res.statusCode);
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Response:', body));
});

req.on('error', console.error);
req.write(data);
req.end();
