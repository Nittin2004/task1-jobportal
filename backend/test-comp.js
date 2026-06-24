async function test() {
  try {
    const res = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'javascript',
        version: '*',
        files: [{ content: 'console.log("hello");' }],
        stdin: '',
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1
      })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch(e) {
    console.log('Error:', e.message);
  }
}
test();
