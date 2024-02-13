import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "aws-serverless-api",
  frameworkVersion: "2",
  plugins: [
    "serverless-webpack",
    "serverless-dynamodb-local",
    "serverless-offline",
  ],
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
    "serverless-offline": {
      httpPort: 3003,
    },
    dynamodb: {
      start: {
        port: 5000,
        inMemory: true,
        migrate: true,
      },
      stages: ["dev"],
    },
  },
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    region: "ap-south-1",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      POSTS_TABLE: "Posts-dev",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:DescribeTable",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem",
        ],
        Resource: "arn:aws:iam::590183785908:user/dynamodb",
      },
    ],
  },
  functions: {
    createPost: {
      handler: "src/functions/createPost.handler",
      events: [
        {
          http: {
            method: "post",
            path: "create-post",
            cors: true,
          },
        },
      ],
    },
    getAllPost: {
      handler: "src/functions/getAllPost.handler",
      events: [
        {
          http: {
            method: "get",
            path: "get-post",
            cors: true,
          },
        },
      ],
    },
    getPost: {
      handler: "src/functions/getPost.handler",
      events: [
        {
          http: {
            method: "get",
            path: "get-post/{postId}",
            cors: true,
          },
        },
      ],
    },
    updatePost: {
      handler: "src/functions/updatePost.handler",
      events: [
        {
          http: {
            method: "put",
            path: "update-post/{postId}",
            cors: true,
          },
        },
      ],
    },
    deletePost: {
      handler: "src/functions/deletePost.handler",
      events: [
        {
          http: {
            method: "delete",
            path: "delete-post/{postId}",
            cors: true,
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      PostsListTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.POSTS_TABLE}",
          AttributeDefinitions: [
            {
              AttributeName: "postId",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "postId",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
