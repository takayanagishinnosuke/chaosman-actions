const core = require('@actions/core');
const github = require('@actions/github');
const openai = require("openai");

async function run() {
  try {
    const githubToken = core.getInput('github-token', { required: true});
    const openaiApiKey = core.getInput('openai-api-key', { required: true});
    const customPrompt = core.getInput('prompt', { required: true});

    const octokit = github.getOctokit(githubToken);
    const client = new openai.OpenAI({ apiKey: openaiApiKey });
    const context = github.context;
    const pull_number = context.payload.pull_request.number;
    const { data: pullRequest } = await octokit.rest.pulls.get({
      ...context.repo,
      pull_number,
    });
    
    const prompt = `##Order\n${customPrompt}\n##Pull Request Title: ${pullRequest.title}\n##Description: ${pullRequest.body}`;
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages:  [{ role: "system", content: prompt}],
      max_tokens: 150
    });
    const generatedComment = completion.choices[0]?.message?.content;
    await octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: pull_number,
      body: generatedComment,
    });

    console.log('Comment posted successfully');

    const { data: files } = await octokit.rest.pulls.listFiles({
      ...context.repo,
      pull_number,
    });
    for (const file of files) {
      if (file.status === 'added' || file.status === 'modified') {
        console.log(`Deleting file: ${file.filename}`);
        await octokit.rest.repos.deleteFile({
          ...context.repo,
          path: file.filename,
          message: `Deleting file ${file.filename} as per the PR!!`,
          sha: file.sha,
          branch: context.payload.pull_request.head.ref,
        });
      }
    }
    console.log('Files deleted successfully');

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
