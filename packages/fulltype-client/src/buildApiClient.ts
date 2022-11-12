import * as ft from "fulltype";
import * as ftApi from "fulltype-api";
import ky from "ky";

type ApiClient<ApiSchemaT extends ftApi.ApiSchema> = {
  [routeName in keyof ApiSchemaT]: (
    input: ft.TypeOf<ApiSchemaT[routeName]["input"]>,
  ) => Promise<{
    output: ft.TypeOf<ApiSchemaT[routeName]["output"]>;
    status: number;
  }>;
};

export const buildApiClient = <ApiSchemaT extends ftApi.ApiSchema>({
  api,
  generateHeaders,
  url,
}: {
  api: ftApi.Api<ApiSchemaT>;
  generateHeaders: () => any; // eslint-disable-line
  url: string;
}): ApiClient<ApiSchemaT> => {
  const apiClient = {} as ApiClient<ApiSchemaT>;
  const schema = api.schema;

  for (const routeName in schema) {
    const apiEndpoint = schema[routeName];
    apiClient[routeName] = async (input) => {
      const response = (await ky
        .post(`${url}/${api.baseUrl}/${routeName}`, {
          headers: generateHeaders(),
          json: {
            input: apiEndpoint!.input.stringify(input), // eslint-disable-line
          },
        })
        .json()) as any;
      console.log("response", response);

      try {
        return {
          // eslint-disable-next-line
          output: apiEndpoint!.output.parse(response.output),
          status: response.status,
        };
      } catch (error) {
        console.log("Error", error);
        // eslint-disable-next-line
        return {
          output: apiEndpoint!.output.generate(),
          status: response.status,
        };
      }
    };
  }

  return apiClient;
};
