import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { Agent } from "undici";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Turso's HTTP endpoint can be slow to establish a first connection from some
// networks, and the default connect timeout (10s) is sometimes too tight for
// that. Give it more room, and retry a couple of times before giving up
// instead of failing the whole request on one slow attempt.
//
// This uses the platform's global `fetch`/`Request` (which is what
// @libsql/client itself uses) rather than the `undici` package's own fetch,
// since undici's fetch doesn't recognize a `Request` built from a different
// module instance and fails to read its URL.
const tursoAgent = new Agent({ connectTimeout: 30_000 });

async function fetchWithRetry(
  input: RequestInfo | URL,
  init: RequestInit = {},
  attempts = 3
): Promise<Response> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    // Clone so a connection failure that already touched the body doesn't
    // poison the next attempt.
    const attemptInput = input instanceof Request ? input.clone() : input;
    try {
      return await fetch(attemptInput, {
        ...init,
        dispatcher: tursoAgent,
      } as RequestInit);
    } catch (err) {
      if (attempt === attempts) throw err;
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }
  throw new Error("unreachable");
}

function createPrismaClient() {
  const adapter = new PrismaLibSQL({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
    fetch: fetchWithRetry,
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
