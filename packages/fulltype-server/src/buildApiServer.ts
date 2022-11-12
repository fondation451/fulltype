import * as ft from "fulltype";
import * as ftApi from "fulltype-api";
import * as bodyParser from "body-parser";
import { Express } from "express";

type Controller<ApiEndpointT extends ftApi.ApiEndpoint> = ({
  headers,
  args,
}: {
  headers: any; // eslint-disable-line
  args: ft.TypeOf<ApiEndpointT["input"]>;
}) => ft.TypeOf<ApiEndpointT["output"]>;

export type Controllers<ApiSchemaT extends ftApi.ApiSchema> = {
  [routeName in keyof ApiSchemaT]: Controller<ApiSchemaT[routeName]>;
};

export const buildApiServer = <ApiSchemaT extends ftApi.ApiSchema>({
  app,
  api,
  controllers,
}: {
  app: Express;
  api: ftApi.Api<ApiSchemaT>;
  controllers: Controllers<ApiSchemaT>;
}): void => {
  const schema = api.schema;

  app.use(bodyParser.json());

  for (const routeName in schema) {
    const apiEndpoint = schema[routeName];
    const controller = controllers[routeName];

    // eslint-disable-next-line
    app.post(`/${api.baseUrl}/${routeName}`, async (req: any, res: any, next: any) => {
      try {
        const output = await controller({
          headers: req.headers,
          // eslint-disable-next-line
          args: apiEndpoint!.input.parse(req.body.input) as any,
        });
        const statusCode = 200;

        res.status(statusCode);
        // eslint-disable-next-line
        res.send({ output: apiEndpoint!.output.stringify(output) });
      } catch (error) {
        res.status(500);
        next(new Error("Request failure"));
      }
    });
  }
};
