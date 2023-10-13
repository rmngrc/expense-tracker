const { DynamoDB, Lambda } = require("aws-sdk");

exports.handler = async function (event: any) {
  console.log("request:", JSON.stringify(event, undefined, 2));

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Hello from Lambda!",
    }),
  };
};
