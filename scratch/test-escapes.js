const trackData = { abstract: "hello\nworld" };
const customScript = `
const sectionParagraphs = {
  "Abstract": \`${trackData.abstract}\`
};
`;
console.log(customScript);
