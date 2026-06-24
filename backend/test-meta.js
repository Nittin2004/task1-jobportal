async function test() {
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              metaData
              exampleTestcases
            }
          }
        `,
        variables: { titleSlug: 'contains-duplicate' }
      })
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch(e) {
    console.log(e.message);
  }
}
test();
