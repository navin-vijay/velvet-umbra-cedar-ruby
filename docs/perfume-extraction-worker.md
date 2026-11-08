# Resumable perfume extraction

The GitHub Actions workflow at `.github/workflows/perfume-extraction.yml`
continues TGSC extraction independently of the Codespace. It starts a bounded
run once an hour and can also be started manually from the repository's Actions
tab. Each run seeds any missing letter listings, extracts up to 250 ingredient
pages (within a 12-minute work budget), and exits. The next run resumes from the
persistent database.

## One-time setup

1. Deploy the app so its database is provisioned, or create a Neon database.
2. In the GitHub repository, open **Settings → Secrets and variables → Actions**
   and add a repository secret named `DATABASE_URL` containing the Neon
   connection string. Do not commit or paste the connection string into source.
3. Push this workflow to the repository's default branch and enable GitHub
   Actions if it is disabled.

The worker refuses to use the local PGLite fallback: it requires `DATABASE_URL`
so progress is durable across workflow runs. It applies pending migrations
before each run. The workflow serializes its own runs, retries failed pages
with backoff up to five attempts, and updates the Excel checkpoint at every
250 completed-page boundary (plus the final completed set).

Scheduled Actions are resumable, not continuously running: GitHub may delay
scheduled jobs, each job has a time limit, and repository Actions quotas apply.
Completed detail records and checkpoints remain in Neon between runs. Browser
downloads still require opening the app; the worker updates the workbook in the
database for the next download.
