import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceFiles = [1, 2, 3, 4].map((partNumber) =>
  resolve(projectRoot, 'assets', `pool-icon-512.part${partNumber}`),
)
const iconBase64 = (
  await Promise.all(sourceFiles.map((path) => readFile(path, 'utf8')))
)
  .map((part) => part.trim())
  .join('')
const publicDirectory = resolve(projectRoot, 'public')

await mkdir(publicDirectory, { recursive: true })
await writeFile(
  resolve(publicDirectory, 'pool-icon-512.png'),
  Buffer.from(iconBase64, 'base64'),
)
