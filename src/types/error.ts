export type ErrorType = 'ExternalServiceError' | 'InvalidInput';
export type Error = {
  message: string;
  type: ErrorType;
};
