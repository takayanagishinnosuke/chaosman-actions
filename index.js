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

    const prompt = `${customPrompt}\n\nPull Request Title: ${pullRequest.title}\nDescription: ${pullRequest.body}`;
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
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
