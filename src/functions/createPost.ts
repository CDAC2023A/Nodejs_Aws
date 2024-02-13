import {
  APIGatewayEvent,
  Handler,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import * as uuid from "uuid";
import middify from "../core/middify";
import formatJSONResponse from "../core/formatJsonResponse";
import PostService from "../../src/database/services/postService"; // Adjust the path as needed
import CreatePost from "../../src/dtos/createPostDto";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

// Assuming you have docClient and tableName defined somewhere
const docClient = new DocumentClient();
const tableName = "POSTS_TABLE"; // Replace this with your actual table name

const postService = new PostService(docClient, tableName); // Create an instance of PostService
export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & CreatePost,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { title, description } = event.body;

    try {
      const postId: string = uuid.v4();

      const post = await postService.createPost({
        postId,
        title,
        description,
        active: true,
        createdAt: new Date().toISOString(),
      });

      return formatJSONResponse(201, post);
    } catch (err) {
      return formatJSONResponse(400, err);
    }
  }
);
