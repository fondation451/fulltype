import * as ft from "fulltype";

export type ApiEndpoint = {
  input: ft.Schema<any>; // eslint-disable-line
  output: ft.Schema<any>; // eslint-disable-line
};

export type ApiSchema = { [routeName: string]: ApiEndpoint };

export type Api<ApiSchemaT extends ApiSchema> = { baseUrl: string; schema: ApiSchemaT };

export const buildApi = <ApiSchemaT extends ApiSchema>({
  baseUrl,
  schema,
}: {
  baseUrl: string;
  schema: ApiSchemaT;
}): Api<ApiSchemaT> => ({ baseUrl, schema });
