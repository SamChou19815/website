import { RouteComponentProps } from 'react-router-dom';

export type RouteComponentsWithProjectIdParameter = RouteComponentProps<{
  readonly projectId: string;
}>;
