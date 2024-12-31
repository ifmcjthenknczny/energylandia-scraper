# energylandia-scraper

**Version**: 1.0.0

This project is a serverless AWS Lambda application designed for scraping data (Energylandia Zator waiting times and opening hours) from API sources. The application uses AWS CDK to provision resources such as VPC, Lambda functions, and CloudWatch Logs, and it is deployed to AWS using Node.js and TypeScript. Deployment is implemented by pushing to main branch, using CI/CD with Github Actions.

---

## Prerequisites

Before running this project, ensure that you have:

- Node.js (v16.x or higher)
- Yarn package manager
- AWS CLI configured with the appropriate credentials
- AWS CDK installed (`npm install -g aws-cdk`)
- Access to necessary AWS services (Lambda, VPC, Scheduler, Secrets Manager, etc.)

---

## AWS Resources

- **Lambda Function**: The app includes Lambda functions for scraping Energylandia’s waiting times and opening hours. These functions are scheduled via AWS Scheduler with CRON expressions.
- **CDK Resources**:
  - Lambda layer for external dependencies (`node_modules`).
  - IAM roles and policies to control access to AWS services like Secrets Manager and Lambda invocations.
  - CloudWatch Log Group for Lambda execution logs.

---

## Actions

The Lambda function supports the following actions:

- **PING**: Simple ping log for health checks.
- **SCRAPE_WAITING_TIMES**: Scrapes and insert into db waiting times data.
- **SCRAPE_OPENING_HOURS**: Scrapes and insert into db park opening hours.

---

## Running the App Locally

1. **Install Dependencies**  
   Run the following command to install project dependencies:

   ```bash
   yarn install
   ```

2. **Configure Environment Variables**  
   Create a `.env` file in the root directory and add the necessary environment variables such as AWS credentials, secret values, etc.

   Example:
   ```bash
   MONGO_URI=mongodb+srv://[username:password@]host[/[defaultauthdb][?options]]
   ```

3. **Set Appropriate Action in `start-local.ts`**  
To test the Lambda function locally, you only need to set the desired action in `start-local.ts`.

You don't need to modify anything else in the file. Just set the desired action from three available ones and follow next steps.

4. **Build the Project**  
   Compile the TypeScript code into JavaScript:

   ```bash
   yarn build
   ```

5. **Run!**  
To run the app locally for testing, use the following command:

```bash
yarn start
```

This will start a local version of the application, which scrapes data to the database of choice.

---

## License

ISC License.

---

## Contact

For questions or feedback, please reach out via GitHub.
[ifmcjthenknczny](https://github.com/ifmcjthenknczny)