import {
  APIGatewayEvent,
  Handler,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import middify from "../core/middify";
import formatJSONResponse from "../core/formatJsonResponse";
import PostService from "../../src/database/services/postService";
import UpdatePost from "../../src/dtos/updatePostDto";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

// Assuming you have docClient and tableName defined somewhere
const docClient = new DocumentClient();
const tableName = "POSTS_TABLE"; // Replace this with your actual table name

const postService = new PostService(docClient, tableName); // Create an instance of PostService
export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & UpdatePost,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    const postId: string = event.pathParameters.postId;
    const { body } = event;
    try {
      const posts = await postService.updatePost(postId, body);

      return formatJSONResponse(200, posts);
    } catch (err) {
      return formatJSONResponse(400, err);
    }
  }
);
