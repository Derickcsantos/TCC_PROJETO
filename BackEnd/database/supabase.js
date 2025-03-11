import {createClient} from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mxhwmpouoajvidghhevq.supabase.co'

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14aHdtcG91b2FqdmlkZ2hoZXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NTI0ODEsImV4cCI6MjA1NzIyODQ4MX0.yPIQaaUTGiqz5LG6KJM43NL-8hIk6mgShsOpm8DEplM'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;