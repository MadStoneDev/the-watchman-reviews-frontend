// Enable performance logging with NEXT_PUBLIC_PERF_LOG=true in .env
const isPerfEnabled =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_PERF_LOG === "true";

export function perfLog(message: string, duration?: number) {
  if (!isPerfEnabled) return;

  if (duration !== undefined) {
    console.log(`⏱️  ${message}: ${duration.toFixed(2)}ms`);
  } else {
    console.log(`📍 ${message}`);
  }
}

export async function measureQuery<T>(
  name: string,
  queryFn: () => Promise<T>,
): Promise<T> {
  if (!isPerfEnabled) {
    return queryFn();
  }

  const start = performance.now();
  try {
    const result = await queryFn();
    const duration = performance.now() - start;
    perfLog(name, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`❌ ${name}: ${duration.toFixed(2)}ms (failed)`, error);
    throw error;
  }
}

export function startTimer() {
  return isPerfEnabled ? performance.now() : 0;
}

export function logTimer(label: string, startTime: number) {
  if (!isPerfEnabled) return;
  perfLog(label, performance.now() - startTime);
}
