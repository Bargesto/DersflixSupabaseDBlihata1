import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vgaqkrlodqwuwfomcmpl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYXFrcmxvZHF3dXdmb21jbXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNDU5NzEsImV4cCI6MjA0ODgyMTk3MX0.aSSIKyFtG3AFVegI5lbDwvIH_IGzZN6qpq1c1nsExzY';

export const supabase = createClient(supabaseUrl, supabaseKey);