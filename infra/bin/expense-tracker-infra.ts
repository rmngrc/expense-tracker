#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WebServiceStack } from "../lib/webservice-stack";

const app = new cdk.App();

new WebServiceStack(app, "ExpenseTrackerWebService", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
