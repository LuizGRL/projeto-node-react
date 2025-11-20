import { ZodSchema } from "zod";
import { AppError } from "../../errors/AppError";

export class ResponseValidator {

  static validate<T>(schema: ZodSchema<T>, data: unknown): T {
    
    const result = schema.safeParse(data);

    if (!result.success) {
      const { fieldErrors, formErrors } = result.error.flatten();
      const formattedError = {
        message: "Validation error",
        errors: {
          fields: fieldErrors,
          form: formErrors
        }
      };        
      throw new AppError(formattedError, 400);
    }

    return result.data;
  }
}