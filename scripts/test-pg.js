// test-pg.js
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:password@localhost:5432/vare_web_db'
});

async function testPg() {
  try {
    await client.connect();
    console.log('✅ pg conectado exitosamente');
    await client.end();
  } catch (error) {
    console.error('❌ Error con pg:', error.message);
  }
}

testPg();