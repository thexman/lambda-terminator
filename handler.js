'use strict';

const { LambdaClient, PutFunctionConcurrencyCommand } = require("@aws-sdk/client-lambda"); // ES Modules import

module.exports.lambdaTerminator = async (event) => {
  console.log("Input: %s", JSON.stringify(event));
  const client = new LambdaClient();

  let batchItemFailures = [];

  if (event != null && event.Records != null && Array.isArray(event.Records)) {
    for (const msg of event.Records) {
      if (msg.body != null) {
        const body = (typeof msg.body === 'string') ? JSON.parse(msg.body) : msg.body;
        if (body != null && body.Trigger != null && body.Trigger.Dimensions != null && Array.isArray(body.Trigger.Dimensions)) {
          const dimension = body.Trigger.Dimensions.find(e => e.name === "FunctionName" && e.value != null);
          if (dimension != null) {
            const functionName = dimension.value;
            console.log("Disabling lambda: %s", functionName);
            const input = {"FunctionName" : functionName, ReservedConcurrentExecutions: 0};
            const command = new PutFunctionConcurrencyCommand(input);
            try {
              const response = await client.send(command);

              const success = (response && response["$metadata"] && response["$metadata"].httpStatusCode && response["$metadata"].httpStatusCode >= 200 && response["$metadata"].httpStatusCode < 300);
              if (!success) {
                batchItemFailures.push({ "itemIdentifier": msg.messageId });
                console.error("Error disabling lambda %s: %s", functionName, JSON.stringify(response));
              } else {
                console.log("Succesfully disabled lambda %s", functionName)
              }
            } catch (err) {
              console.error(err);
              batchItemFailures.push({ "itemIdentifier": msg.messageId });
            }
          }
        }
      } else {
        log.error("Message %s has no body", msg.messageId);
      }
    }
  }


  return {
    "batchItemFailures": batchItemFailures
  }
};
