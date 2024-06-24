<header>

# ChaosMan Actions

<img src=https://mypublicbucket-fhaifhac45725.s3.ap-northeast-1.amazonaws.com/main_logo.jpg alt=celebrate width=150 align=right>

This action does the worst thing a developer can do!

It is triggered by a pull request!

HaHaHa!!!!

</header>

## Use the action

### It's easy to use!!

1. Settings -> Actions -> General -> Workflow permissions -> Read and write permissions

2. Settings -> Seacrets and variables -> Actions -> New repository secret -> Name: `OPENAI_API_KEY` -> Value: your-openai-api-key

3. Create a `.github/workflows/workflow.yml`

file in your repository with the following content:

```yaml
on:
  pull_request:
    types: [opened, reopened]

jobs:
  comment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: PR Commenter
        uses: takayanagishinnosuke/chaosman-actions@v0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          prompt: 'このプルリクストを解析してユーザーの元気を無くす一言を返してください。'
```

4. Create a pull request and see the magic happen! HaHa!!!!

<footer></footer>
