export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}
