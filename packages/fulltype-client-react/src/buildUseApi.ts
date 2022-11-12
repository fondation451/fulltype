import * as ft from "fulltype";
import * as ftApi from "fulltype-api";
import * as ftClient from "fulltype-client";
import { useEffect, useState } from "react";

type ApiOutput<ApiSchemaT extends ftApi.ApiSchema, RouteNameT extends keyof ApiSchemaT> =
  | {
      output: ft.TypeOf<ApiSchemaT[RouteNameT]["output"]>;
      status: number;
      isLoaded: true;
      input: ApiSchemaT[RouteNameT]["input"];
      refetch: (input?: ft.TypeOf<ApiSchemaT[RouteNameT]["input"]>) => void;
    }
  | {
      output: undefined;
      status: undefined;
      isLoaded: false;
      input: ApiSchemaT[RouteNameT]["input"];
      refetch: (input?: ft.TypeOf<ApiSchemaT[RouteNameT]["input"]>) => void;
    };

type UseApi<ApiSchemaT extends ftApi.ApiSchema> = <RouteNameT extends keyof ApiSchemaT>(
  routeName: RouteNameT,
  input: ft.TypeOf<ApiSchemaT[RouteNameT]["input"]>,
) => ApiOutput<ApiSchemaT, RouteNameT>;

export const buildUseApi = <ApiSchemaT extends ftApi.ApiSchema>({
  api,
  generateHeaders,
  url,
}: {
  api: ftApi.Api<ApiSchemaT>;
  generateHeaders: () => any; // eslint-disable-line
  url: string;
}): UseApi<ApiSchemaT> => {
  const apiClient = ftClient.buildApiClient({ api, generateHeaders, url });

  return <RouteNameT extends keyof ApiSchemaT>(
    routeName: RouteNameT,
    input: ft.TypeOf<ApiSchemaT[RouteNameT]["input"]>,
  ) => {
    const [output, setOutput] = useState<
      ft.TypeOf<ApiSchemaT[RouteNameT]["output"]> | undefined
    >(undefined);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [status, setStatus] = useState<number | undefined>(undefined);
    const [refetchFlag, setRefetchFlag] = useState<boolean>(false);
    const [currentInput, setCurrentInput] =
      useState<ft.TypeOf<ApiSchemaT[RouteNameT]["input"]>>(input);

    useEffect(() => {
      // eslint-disable-next-line
      apiClient[routeName](currentInput as any).then(
        ({ output, status }) => {
          setOutput(output);
          setIsLoaded(true);
          setStatus(status);
        },
        () => {
          setIsLoaded(true);
          setStatus(500);
        },
      );
    }, [refetchFlag]);

    return {
      output,
      status,
      isLoaded,
      input: currentInput,
      refetch: (input?: ft.TypeOf<ApiSchemaT[RouteNameT]["input"]>) => {
        if (input) {
          setCurrentInput(input);
        }
        setIsLoaded(false);
        setStatus(undefined);
        setRefetchFlag(!refetchFlag);
      },
    } as ApiOutput<ApiSchemaT, RouteNameT>;
  };
};
