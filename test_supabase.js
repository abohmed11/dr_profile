import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (url && key) {
  const supabase = createClient(url, key);
  supabase.from('banners').select('*').then(({data, error}) => {
    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
  });
} else {
  console.log("No supabase config");
}
