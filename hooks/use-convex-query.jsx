import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useConvexQuery = (query, ...args) => {
  const result = useQuery(query, ...args);
  const [data, setData] = useState(result);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (result === undefined) {
      setIsLoading(true);
    } else {
      try {
        setData(result);
        setError(null);
      } catch (error) {
        setError(error);
        toast.error(`Error fetching data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  }, [result]);

  return { data, isLoading, error };
};
export const useConvexMutation = (mutation, ...args) => {
  const mutFn = useMutation(mutation);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const mutate = async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await mutFn(...args);
      setData(response);
      return response;
    } catch (error) {
      setError(error);
      toast.error(`Error executing mutation: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  return { mutate, data, isLoading, error };
};
