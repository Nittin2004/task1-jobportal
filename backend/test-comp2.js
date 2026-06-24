async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/compiler/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: 'javascript', code: 'console.log("hello");', stdin: '' })
    });
    const data = await res.json();
    console.log(data);
  } catch(e) {
    console.log('Error:', e.message);
  }
}
test();
