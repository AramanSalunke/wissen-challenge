# CronAngular

Web-based tool for crafting and analyzing cron scheduling expressions using Angular framework.

Angular CLI version: 19.2.7

## Application Features

### 1. Export Functionality
- Enables direct clipboard transfer of scheduling expressions and their interpretations
- Facilitates quick duplication through single-action copying

### 2. Quick-Start Templates
- Provides 5 pre-built scheduling options: Hourly intervals, Nightly executions (00:00), Business days at 9:00 AM, 15-minute cycles, Monthly beginning
- Reduces configuration time by offering standard scheduling patterns

### 3. Smart Input Analysis
- Validates individual time components with precision
- Presents informative feedback for incorrect syntax
- Recognizes various input methods: numeric spans (1-5), recurring patterns (*/5), discrete values (1,3,5), and month/day abbreviations (JAN, MON)

### 4. Execution Timeline Preview
- Calculates and displays 5 forthcoming trigger points
- Offers immediate schedule visualization
- Refreshes predictions based on modified parameters

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
