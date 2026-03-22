/**
 * Type-safe access to Lambda environment variables injected by backend.ts.
 * The actual $amplify/env/* pattern requires esbuild alias configuration
 * that Amplify configures during CDK bundling. This wrapper provides the
 * same type safety without the module resolution dependency.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
