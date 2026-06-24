async function test() {
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      query: `query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          content
          exampleTestcases
        }
      }`,
      variables: { titleSlug: 'two-sum' }
    })
  });
  const data = await res.json();
  const content = data.data.question.content;
  const preRegex = /<pre>(.*?)<\/pre>/gis;
  let match;
  while ((match = preRegex.exec(content)) !== null) {
     console.log('PRE:', match[1]);
  }
}
test();
