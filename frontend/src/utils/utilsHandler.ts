import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;

    if (data) {

      if (data.message?.errors?.fields) {
        const fields = data.message.errors.fields;
        
        const fieldValues = Object.values(fields);

        if (fieldValues.length > 0) {
          const firstFieldErrorArray = fieldValues[0] as string[];
          if (Array.isArray(firstFieldErrorArray) && firstFieldErrorArray.length > 0) {
            return firstFieldErrorArray[0]; 
          }
        }
      }
      if (typeof data.message?.message === 'string') {
        return data.message.message;
      }

      if (typeof data.message === 'string') {
        return data.message;
      }

      if (Array.isArray(data.message)) {
        return data.message[0];
      }

      if (data.error) {
        return data.error;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
};