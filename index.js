import 'dotenv/config'

import buildHomeworkTable from "./src/homework-table.js";
import makeHomeworkReadme from "./src/homework-readme.js";
import { overwriteGithubFile } from "./src/github-tms.js";
import * as fs from 'fs';

const table = await buildHomeworkTable()
const readme = makeHomeworkReadme(table)

fs.writeFileSync('build/output.md', readme, 'utf-8')
console.log('check build/output.md\n')

console.log('updating https://github.com/vshat-tms/homework-all')
await overwriteGithubFile('homework-all', 'README.md', 'Generate new README.md', readme)
console.log('done')
