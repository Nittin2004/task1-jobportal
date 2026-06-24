async function test() {
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              exampleTestcases
            }
          }
        `,
        variables: { titleSlug: 'two-sum' }
      })
    });
    const data = await res.json();
    console.log(data);
  } catch(e) {
    console.log(e.message);
  }
}
test();
