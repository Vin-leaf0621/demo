import { useLocation } from '@umijs/max';
import queryString from 'query-string';

export default function useQuery() {
  const { search } = useLocation();

  const query = queryString.parse(search || null);

  return query;
}
