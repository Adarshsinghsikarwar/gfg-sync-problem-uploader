import inquirer from 'inquirer';

/**
 * Last-resort fallback: asks you to paste whatever fields the previous
 * strategies couldn't fill in. Existing values are kept as-is, so if
 * apiStrategy/scrapeStrategy already got the title and difficulty, you
 * only get prompted for the statement/examples/constraints.
 */
export async function fetchViaManual(existing = {}) {
  const questions = [];

  if (!existing.title) {
    questions.push({ name: 'title', message: 'Problem title:' });
  }
  if (!existing.difficulty) {
    questions.push({ name: 'difficulty', message: 'Difficulty (Easy/Medium/Hard):' });
  }
  if (!existing.tags || existing.tags.length === 0) {
    questions.push({ name: 'tagsRaw', message: 'Tags (comma separated, optional):' });
  }
  if (!existing.statement) {
    questions.push({ name: 'statement', message: 'Paste problem statement:', type: 'editor' });
  }
  questions.push({
    name: 'examplesRaw',
    message: 'Paste examples block (Input/Output/Explanation), optional:',
    type: 'editor',
  });
  questions.push({
    name: 'constraintsRaw',
    message: 'Paste constraints, one per line, optional:',
    type: 'editor',
  });

  const answers = await inquirer.prompt(questions);

  return {
    title: existing.title || answers.title,
    difficulty: existing.difficulty || answers.difficulty,
    tags:
      existing.tags && existing.tags.length
        ? existing.tags
        : (answers.tagsRaw || '').split(',').map((t) => t.trim()).filter(Boolean),
    statement: existing.statement || answers.statement,
    examples: answers.examplesRaw ? [{ raw: answers.examplesRaw }] : existing.examples || [],
    constraints: answers.constraintsRaw
      ? answers.constraintsRaw.split('\n').filter(Boolean)
      : existing.constraints || [],
  };
}
