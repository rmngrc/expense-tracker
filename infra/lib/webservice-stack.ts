import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import path = require("path");

/**
 * This stack deploys a simple webservicestack, which is made of:
 * API Gateway → Lambda → DynamoDB
 */
export class WebServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const table = new dynamodb.Table(this, "Expenses", {
      partitionKey: { name: "id", type: cdk.aws_dynamodb.AttributeType.STRING },
      readCapacity: 1,
      writeCapacity: 1,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    table.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 5,
    });

    // Lambda Function
    const handler = new lambda.Function(this, "ExpensesHandler", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      code: cdk.aws_lambda.Code.fromAsset(
        path.join(__dirname, "../../service")
      ),
      handler: "expense.handler",
      environment: {
        EXPENSES_TABLE_NAME: table.tableName,
      },
    });

    // Grant lambda read/write permissions on the DynamoDB table
    table.grantReadWriteData(handler);

    // API Gateway
    const api = new apigateway.LambdaRestApi(this, "ExpensesAPI", {
      handler,
    });

    // Output the API URL
    new cdk.CfnOutput(this, "API URL", {
      value: api.url,
    });
  }
}
