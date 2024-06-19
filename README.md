
# Local first tasks dashboard

A reactive, real-time task management dashboard inspired by Linear. Built with Electric SQL, Redux and Vite.

## Demo

It's deployed with Cloudflare pages at [tasks.alexmcgovern.com](https://tasks.alexmcgovern.com/)

## Features

- Real-time CRUD functionality powered by [ElectricSQL](https://electric-sql.com/)
- Built with a feature-complete component library which is a side-project of mine, [Boondoggle](https://boondoggle.design/)
- Monorepo architecture, using NPM workspaces (no deps) for isolation & module privacy 
- Sentry error boundary — drop in a DSN to enable error tracking
- Strict static analysis config
- State management with [Redux Toolkit](https://redux-toolkit.js.org/)
- Unit testing with [Vitest](https://vitest.dev/)
- E2E tesing with [Cypress](https://www.cypress.io/)
- "Build-test-deploy" CI/CD workflow with Github Actions

## Technology choices

### Project structure

An approach I have been favouring in recent projects is a monorepo architecture. In my opinion, it's the best approach for separation of concerns in a large Typescript project.

I usually split code up into 2 main categories, `@shared` and `@domain`. `@shared` contains all of the shared logic, such as state management, utilities, and global UI components. `@domain` contains all of the domain-specific logic, such as the tasks feature in this project.

In a larger app, with multiple concerns, and a large team working on it, this type of architecture would scale well, as it allows for devs to work independently on different sections of the app without creating a lot of conflicts.

Managing dependencies and versioning across monorepos can become a pain, especially as projects grow. There are tools available to ease this pain, such as [Lerna](https://lerna.js.org/) or [TurboRepo](https://turbo.build/repo) but I find that for small projects, NPM workspaces is sufficient.

### Data persistence

In lieue of the recommended local storage, I opted to use [ElectricSQL](https://electric-sql.com/) (which is an alpha stage product). I had wanted to experiment with a local first web app anyway, and this seemed to be a good opportunity to do so.

This didn't complicate the project very much at all, and if anything, the code-gen to generate schemas and types probably sped development up a bit. The backend is deployed with Digital Ocean (for speed, as ElectricSQL have a fairly straightforward guide), but could be deployed anywhere you can run Docker and Postgres with logical replication. The backend setup is intentionally very simple, as the focus of this project is the frontend.

After trialing Electric SQL for this project, I don't think it's quite ready for production. It has a few limitations (that I've come across so far), that would proclude me from using for something more serious:

- Updating "electrified" enum values is not possible
- No support for VARCHAR with a length constraint (hello DDoS)
- "Un-electrifiying" a table is not possible at this point (but is WIP), making it impossible to drop a table

### State management

I went with Redux because it's what I'm most familiar with. I centralized all of the shared logic (state, store) in a monorepo package, `@shared/redux` and all of the slices / reducer logic is local to the tasks domain, in `@domain/tasks`.

The Redux state is used to keep track of user interactions, like task selection, filtering and defaults (default status, priority, "create another", etc). It's not used to keep track of the tasks themselves, components directly interact with the DB client to query and mutate tasks.

If I had more time, I would have like to investigate moving the DB logic into Redux, either using RTK query with fake endpoints, or with middleware, to allow access to dispatch and state. This would allow me to chain side effects to DB mutations, (e.g. clearing a selection after a task is deleted).

### Routing

I chose a very simple routing library, [`wouter`](https://github.com/molefrog/wouter) for this project for the following reasons:
- It's dead simple — I didn't think this project warranted the complexity of React Router or Tanstack Router, which are other libraries I've used in the past.
- It's tiny (2.1kb)
- It has all the features needed for a toy project like this

### Testing and CI/CD

For testing, I usually lean more into integration and E2E testing, as I feel that it provides the highest value for the time spent. I wrote a pretty thorough suite of Cypress tests, and where needed, unit tests with Vitest (usually in-source, which I prefer, to keep proliferation of test files down).

For deployment, I have a fairly simple Github Actions workflow, which runs Code Quality checks, runs Cypress against the live DB* and then builds the frontend and deploys it to Cloudflare Pages.

There is a step missing, which is to run any new migrations using the sync service. At this point in time, I deemed it unnecessary as the schema is quite stable, but this is something that would be added in a real-world scenario.

**I usually favour running E2E tests against the backend/DB in a dev environment, as I feel it gives a higher level of confidence that the frontend and backend are in sync. Where this is not possible, I would usually run the backend in-memory and test against it, and as a last resort, mock the API calls to the backend (though not preferred, as synchronizing mocks to the state of the backend can be a time-sink)*

## Useful scripts

- `npm run backend:up` — Start the backend
- `npm run backend:down` — Tear down the backend, remove any containers
- `npm run db:migrate` — Apply migrations
- `npm run dev` — Start the dev server for the frontend
- `npm run build && npm run preview` — Do a prod build and serve it
- `npm run check` — Run static analysis checks & unit tests: `eslint`, `prettier`, `tsc`, `vitest` and [`knip`](https://knip.dev/)
- `npm run fix` — Fix any auto-fixable static analysis / formatting issues
- `npm run cy:run` — Run E2E tests
- `npm run client:generate` — Generate the client, zod schemas and types from the DB schema

## Run Locally

> [!IMPORTANT]  
> Font Awesome Pro is a dependency of the component libray, which requires an API token.
> 
> It's assumed that this is available to the reviewer, but if necessary can be shared securely — just reach out and ask.

<details>
<summary>Authenticating Font Awesome</strong></summary>
<br />
In order to install FontAwesome icon library, you will to export a `FONTAWESOME_TOKEN`
global environment variable on your machine.

Once you've obtained this token, (assuming you're using `zsh`, the default shell on Mac
OS) you can export it like so:

1. Open your `.zshrc` for editing using your preferred method, e.g. by running:

    ```shell
    open ~/.zshrc
    ```

2. Add this line: (substituting in your token)

    ```shell
    export FONTAWESOME_TOKEN={TOKEN}
    ```

3. once saved, you can source your updated `.zshrc` by running:

    ```shell
    source ~/.zshrc
    ```

---

_Then proceed with installation..._
</details>

<br />

Clone the project

```bash
  git clone git@github.com:alex-mcgovern/local-first-tasks-dashboard.git
```

Go to the project directory

```bash
  cd local-first-tasks-dashboard
```

Install dependencies

```bash
  npm i
```

> [!IMPORTANT]  
> Docker and Node.js are required to run this project.

Configure environment variables

```bash
  cp .env.example .env.local
```

Start the backend

```bash
  npm run backend:up
```

Apply migrations
  
```bash
  npm run db:migrate
```

Start the React dev server

```bash
  npm run dev
```

At this point, you should now be able to run the app at: [http://localhost:5173/](http://localhost:5173/)


Or do a prod build

```bash
  npm run build && npm run preview
```

Which will also serve the app at: [http://localhost:5173/](http://localhost:5173/)

### 💥 Didn't work?

I'm sorry to hear that! I have run through these steps from a clean start, but I may have missed something. Please reach out, or take a look at the [quick start guide](https://electric-sql.com/docs/quickstart) from ElectricSQL.

## Known issues

- [ ] UI slows down with a large number of records — to remedy this would probably reach for pagination on the DB queries or virtualization on the frontend
- [ ] Keyboard shortcut to open Dialog doesn't focus the "title" field, when the Drawer with task details is already open — this seems to be caused by trapping the focus in the Drawer on open — which is desirable for keyboard navigation — but may require some extra massaging to make it a nicer user experience
- [ ] Task dialog should scroll to top on reset
- [ ] Keyboard navigation is somewhat clunky and could use some more work


## What would I have done if I had more time?

- [ ] Add running migrations to the CI/CD pipeline
- [ ] Move DB logic into Redux, either using RTK query with fake endpoints, or with middleware, to allow access to dispatch and state
- [ ] Round out styling — particularly on smaller screens, and add a mobile menu
- [ ] Separate out the backend into multiple environments — but there's also a monetary cost to this
