const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function main() {
  const env = fs.readFileSync('.env.example', 'utf8');
  // I don't have .env, wait.
}
