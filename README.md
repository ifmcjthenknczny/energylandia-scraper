# Energylandia waiting time scraper

<table width="100%">
  <tr>
  <td align="left"><a href="https://energylandia-scraper.vercel.app">Deployed site</a></td>
  <td align="right" style="text-align: right;"><a href="https://energylandia.pl/en">What is Energylandia Zator?</a></td>
  </tr>
</table>

This project is a serverless AWS Lambda application designed for scraping data (Energylandia Zator waiting times and opening hours) from API sources, storing them in MongoDB and showing the statistics on frontend.

The application uses AWS CDK to provision resources such as Lambda, Scheduler and CloudWatch Logs, as it is deployed to AWS using Node.js and TypeScript, while Next.js part of application is deployed to Vercel. Deployment is implemented by pushing to `main` branch, using CI/CD with Github Actions.

Project started and stores data from October 5th, 2024.

## Table of contents

- [Project Structure](#project-structure)
- [Main Technologies Used](#main-technologies-used)
- [Local Setup and Development](#local-setup-and-development)
   * [Backend (lambda-scraper)](#backend-lambda-scraper)
   * [Database](#database)
   * [Deployment](#deployment)
   * [Useful commands](#useful-commands)
   * [Environmental variables](#environmental-variables)
- [AWS Resources](#aws-resources)
- [Lambda Actions](#lambda-actions)
- [Database Collections](#database-collections)
- [Migrations](#migrations)
- [Roadmap](#roadmap)
- [Project Motivation](#project-motivation)
- [License](#license)
- [Contact](#contact)

## Project Structure

The project is divided into three main directories:
1. *deployer* - Infrastructure and deployment stack (CDK) for the project, including all AWS stuff - services, schedulers etc.
2. *energylandia-stats* - Fullstack (frontend and API) application that presents the calculated queue times by attraction with the option to select data filters. It is deployed on Vercel.
3. *lambda-scraper* - A backend service responsible for periodical fetching data concering opening times and queue time to attractions from API sources. Deployed as AWS Lambda.

## Main Technologies Used

* Typescript 5
* Next.js 14
* Tailwind CSS 3
* Node.js 22
* AWS Lambda
* MongoDB + Mongoose

## Local Setup and Development

1. Clone the repository
2. Install `yarn` if you haven't already:
```npm install --global yarn``` 

### Frontend (energylandia-stats)

3. Navigate to `energylandia-stats` directory:
```cd energylandia-stats```

4. Clone `.env.example` file, rename it to `.env` and fill it with your credentials.

5. Install dependencies:
```yarn install```

6. Run the development server:
```yarn dev```

### Backend (lambda-scraper)
3. Make sure your installed version of Node is at least 22:
```node -v```

If not, follow [instructions on offical Node site](https://nodejs.org/en/download).

4. Navigate to `lambda-scraper` directory:
```cd lambda-scraper```

5. Clone `.env.example` file, rename it to `.env` and fill it with your credentials.

6. Install dependencies:
```yarn install```

7. Write in the desired Lambda command in ```start-lambda.js``` file.

8. You can build and start the backend by running:
```yarn buildAndStart```

### Database

Database type for this project is NOSQL MongoDB. I recommend downloading MongoDB Compass (from [here](https://www.mongodb.com/try/download/compass)) and feed it with your database `MONGO_URI` (free tier is available by signing up [here](https://www.mongodb.com/cloud/atlas/register)) to view raw data in your DB in a comfortable way.

### Deployment

If you want to deploy this app on your own it will require for you to configure your AWS environment for yourself, as well as filling Github Repository Actions Secrets and variables for yourself.

### Useful commands

To maintain same code styling and quality, every main directory has ```yarn checkAll``` command that formats, lints (with fixing potentially fixable issues) and builds code.

### Environmental variables

For both `lambda-scraper` and `energylandia-stats` only one environmental variable is needed to be filled, which is `MONGO_URI`. Here is a schema of how to fill it:
```MONGO_URI=mongodb+srv://[username:password@]host[/[defaultauthdb][?options]]```

## AWS Resources

- **Lambda Function**: The app includes Lambda functions for scraping Energylandia’s waiting times and opening hours. These functions are scheduled via AWS Scheduler with CRON expressions.
- **CDK Resources**:
  - Lambda layer for external dependencies (`node_modules`).
  - IAM roles and policies to control access to AWS services like Secrets Manager and Lambda invocations.
  - CloudWatch Log Group for Lambda execution logs.
  - Schedulers for Lambda Actions

## Lambda Actions

The Lambda function supports the following actions:

- **PING**: Simple ping log for health checks.
- **SCRAPE_WAITING_TIMES**: Scrapes and insert into db waiting times data. Runs once every 15 minutes, timeouts in 30 seconds. Ends run if Energylandia is closed.
- **SCRAPE_OPENING_HOURS**: Scrapes and insert into db opening hours of Energylandia Zator.
- **MIGRATION**: Runs migration of choice and inserts data about it into database.

## Database Collections

* *EnergylandiaOpeningHours* - stores documents concerning opening and closing hour of Energylandia (one a day).
* *EnergylandiaWaitingTime* - stores documents concerning queue time to attractions with hour it was scraped for.
* *Migration* - stores documents concerning failed and successful migrations performed on DB.

## Migrations

Migrations are implemented in a simplified manner. The migration function to be executed is assigned to the `migrationFunction` variable in `lambda-app.ts` and triggered by running the lambda locally with action: `ActionType.MIGRATION`. The function that modifies the database is wrapped in another function that records its execution in a database collection and verifies whether the migration has already been processed.

## Roadmap

- Insert `MONGO_URI` secret directly into Lambda envs
- Frontend looks upgrade and more stats
- More filters in frontend/API
- Make it more error-proof (a lot of stuff is dependent on external API)
- Upgdade to Next 15
- Monorepo

## Project Motivation

This project was created to "cheat the system" and statistically optimize my next visit to Energylandia. I’ve only been there once, and I felt like I spent too much time waiting in lines and moving inefficiently between attractions. Next time, I hope to change that by making data-driven decisions for a better experience.

## License

This work is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).

## Contact

For questions or feedback, please reach out via GitHub.
[ifmcjthenknczny](https://github.com/ifmcjthenknczny)