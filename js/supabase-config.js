const SUPABASE_URL      = 'https://pfwnyjegymlmksqrkjln.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmd255amVneW1sbWtzcXJramxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MzQ1MDksImV4cCI6MjA5MTUxMDUwOX0.N7hMnA_1RbR4DmJCmnYa4Kc274ecQrRWfO-9pa3mQws'

window._sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
