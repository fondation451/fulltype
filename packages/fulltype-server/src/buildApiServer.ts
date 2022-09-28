import { Express } from "express";
import * as ft from "fulltype";
import * as ftApi from "fulltype-api";

type Controller<ApiEndpointT extends ftApi.ApiEndpoint> = ({
  headers,
  args,
}: {
  headers: any;
  args: ft.TypeOf<ApiEndpointT["input"]>;
}) => ft.TypeOf<ApiEndpointT["output"]>;

export const buildApiServer = <ApiSchemaT extends ftApi.ApiSchema>({
  app,
  api,
  controllers,
}: {
  app: Express;
  api: ftApi.Api<ApiSchemaT>;
  controllers: {
    [routeName in keyof ApiSchemaT]: Controller<ApiSchemaT[routeName]>;
  };
}): void => {
  const schema = api.schema;

  for (const routeName in schema) {
    const apiEndpoint = schema[routeName];
    const controller = controllers[routeName];

    app.post(`${api.baseUrl}/${routeName}`, async (req: any, res: any, next: any) => {
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
