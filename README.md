lambda-terminator is a lambda function for throttling other lambdas. useful to automate CloudWatch alarm actions.

# Requirements

Create a deployment bucket where all the serverless deployments will be uploaded.
The bucket name should be `serverless-deployments-${aws:accountId}` where `${aws:accountId}` is the AWS account number.

# Deploying

```
serverless deploy
```

# Removing

```
serverless remove
```


# Usage

1. Create a new CloudWatch alarm and select the metric (usually this is `ConcurrentExecutions` of the target lambda)
![](docs/AlarmMetric.png)

2. Select the alarm threshold at which the target lamdba will be disabled.
![](docs/AlarmThreshold.png)

3. Configure alarm to send notification to SNS topic (e.g. `disable-lambda`).
![](docs/AlarmSNS.png)

4. Subscribe the terminator lambda queue to the SNS topic of the alarm.
![](docs/SQSSubscribe.png)

![](docs/SNSSelection.png)

5. Change the subscription and enable raw delivery.
![](docs/SNSSubscriptionList.png)

![](docs/SNSRawDelivery.png)