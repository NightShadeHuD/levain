import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : path.endsWith(".ts") ? [path] : [];
  });
}

// Comments may name the forbidden things (to explain why); code may not.
const code = (path: string) =>
  readFileSync(path, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");

describe("purity", () => {
  it("core never touches the DOM, the clock or Math.random", () => {
    const forbidden = [/\bdocument\b/, /\bwindow\b/, /\bDate\b/, /Math\.random/, /performance\.now/, /from\s+["'].*\/ui\//, /localStorage/];
    const core = files("src/core");
    expect(core.length).toBeGreaterThan(0);
    for (const path of core) {
      for (const pattern of forbidden) {
        expect(code(path), `${path} uses ${pattern}`).not.toMatch(pattern);
      }
    }
  });

  it("the game makes no network calls", () => {
    for (const path of files("src")) {
      for (const pattern of [/\bfetch\s*\(/, /XMLHttpRequest/, /WebSocket/, /sendBeacon/, /EventSource/]) {
        expect(code(path), `${path} uses ${pattern}`).not.toMatch(pattern);
      }
    }
  });
});
