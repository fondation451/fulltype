import * as ft from "fulltype";
import * as ftApi from "fulltype-api";

type ApiClient<ApiSchemaT extends ftApi.ApiSchema> = {
  [routeName in keyof ApiSchemaT]: (
    input: ft.TypeOf<ApiSchemaT[routeName]["input"]>,
  ) => Promise<{ output: ft.TypeOf<ApiSchemaT[routeName]["output"]>; status: number }>;
};

export const buildApiClient = <ApiSchemaT extends ftApi.ApiSchema>({
  api,
  generateHeaders,
  url,
}: {
  api: ftApi.Api<ApiSchemaT>;
  generateHeaders: () => any;
  url: string;
}): ApiClient<ApiSchemaT> => {
  const apiClient = {} as ApiClient<ApiSchemaT>;
  const schema = api.schema;

  for (const routeName in schema) {
    const apiEndpoint = schema[routeName];
    apiClient[routeName] = async (input) => {
      const response = await fetch(`${url}/${api.baseUrl}/${routeName}`, {
        // eslint-disable-next-line
        body: JSON.stringify({ input: apiEndpoint!.input.stringify(input) }),
        cache: "default",
        headers: generateHeaders(),
        method: "post",
        mode: "cors",
      });

      try {
        const { output } = JSON.parse(await response.text());

        // eslint-disable-next-line
        return { output: apiEndpoint!.output.parse(output), status: response.status };
      } catch (error) {
        // eslint-disable-next-line
        return { output: apiEndpoint!.output.generate(), status: response.status };
      }
    };
  }

  return apiClient;
};
