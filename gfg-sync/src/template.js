export function buildMarkdown({ problem, url, solutionCode, lang, notes }) {
  const tags = (problem.tags || []).join(', ') || '—';
  const examplesBlock = formatExamples(problem.examples);
  const constraintsBlock =
    (problem.constraints || []).map((c) => `- ${c}`).join('\n') || '—';

  return `# ${problem.title || 'Untitled Problem'}

**Difficulty:** ${problem.difficulty || 'Unknown'}
**Topics:** ${tags}
**Link:** [GFG Problem](${url})

## Problem Statement

${problem.statement || '_Add the problem statement here._'}

## Examples

${examplesBlock}

## Constraints

${constraintsBlock}

## Solution

\`\`\`${lang}
${solutionCode}
\`\`\`
${notes ? `\n## Approach / Notes\n\n${notes}\n` : ''}
---
_Synced on ${new Date().toISOString().slice(0, 10)}_
`;
}

function formatExamples(examples) {
  if (!examples || examples.length === 0) {
    return '_No examples captured — add manually._';
  }
  return examples
    .map((ex, i) => {
      if (ex.raw) return ex.raw;
      return `**Example ${i + 1}:**\n\nInput: ${ex.input}\nOutput: ${ex.output}${
        ex.explanation ? `\nExplanation: ${ex.explanation}` : ''
      }`;
    })
    .join('\n\n');
}
