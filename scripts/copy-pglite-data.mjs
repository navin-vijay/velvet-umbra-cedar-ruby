import { copyFileSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const outputDirectory = resolve(".vercel/output/functions/__server.func/_libs");
if (!existsSync(outputDirectory)) {
  throw new Error(`Built server library directory is missing: ${outputDirectory}`);
}

for (const file of ["initdb.wasm", "pglite.data", "pglite.wasm"]) {
  const source = resolve(`node_modules/@electric-sql/pglite/dist/${file}`);
  const destination = resolve(outputDirectory, file);
  if (!existsSync(source)) {
    throw new Error(`PGlite runtime asset is missing: ${source}`);
  }
  copyFileSync(source, destination);
  console.log(`[build] copied ${file} (${statSync(destination).size} bytes)`);
}
