const engineName = '🪶-Engine';

export function log(invoker: any, message: string): void {
  console.log(`[${engineName}:${invoker.constructor.name}]: ${message}`);
}

export function debug(invoker: any, message: string): void {
  console.debug(`[${engineName}:${invoker.constructor.name}]: ${message}`);
}
export function warn(invoker: any, message: string): void {
  console.warn(`[${engineName}:${invoker.constructor.name}]: ${message}`);
}
export function error(invoker: any, message: string): void {
  console.error(`[${engineName}:${invoker.constructor.name}]: ${message}`);
}
export function info(invoker: any, message: string): void {
  console.info(`[${engineName}:${invoker.constructor.name}]: ${message}`);
}
