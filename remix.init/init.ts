import { spawn } from 'child_process'
import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'

import sort from 'sort-package-json'

const here = (...s: Array<string>) => path.join(__dirname, ...s)

function escapeRegExp(string: string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getRandomString(length: number) {
  return crypto.randomBytes(length).toString('hex')
}

async function exec(
  command: string,
  {
    cwd,
    stdio = 'inherit',
  }: { cwd?: string; stdio?: 'inherit' | 'ignore' } = {},
) {
  const child = spawn(command, { shell: true, stdio, cwd })
  await new Promise((res, rej) => {
    child.on('exit', code => {
      if (code === 0) {
        res(code)
      } else {
        rej(code)
      }
    })
  })
}
export default async function init() {
  const rootDirectory = here('..')
  const INIT_README_PATH = path.join(rootDirectory, 'remix.init', 'README.md')
  const README_PATH = path.join(rootDirectory, 'README.md')
  const EXAMPLE_ENV_PATH = path.join(rootDirectory, '.env.sample')
  const ENV_PATH = path.join(rootDirectory, '.env')
  const PACKAGE_JSON_PATH = path.join(rootDirectory, 'package.json')

  const REPLACER = 'APP_NAME'

  const DIR_NAME = path.basename(rootDirectory)

  const APP_NAME = DIR_NAME
    // get rid of anything that's not allowed in an app name
    .replace(/[^a-zA-Z0-9-_]/g, '-')

  const [readme, env, packageJson] = await Promise.all([
    fs.readFile(INIT_README_PATH, 'utf-8'),
    fs.readFile(EXAMPLE_ENV_PATH, 'utf-8'),
    fs.readFile(PACKAGE_JSON_PATH, 'utf-8'),
  ])

  const newEnv = env.replace(
    /^SESSION_SECRET=.*$/m,
    `SESSION_SECRET="${getRandomString(16)}"`,
  )

  const newReadme = readme.replace(
    new RegExp(escapeRegExp(REPLACER), 'g'),
    APP_NAME,
  )

  const newPackageJson =
    JSON.stringify(
      sort({ ...JSON.parse(packageJson), name: APP_NAME }),
      null,
      2,
    ) + '\n'

  const { default: ora } = await import('ora')

  let spinner = ora('🏃‍ Replacing names').start()
  await Promise.all([
    fs.writeFile(README_PATH, newReadme),
    fs.writeFile(ENV_PATH, newEnv),
    fs.writeFile(PACKAGE_JSON_PATH, newPackageJson),
    fs.copyFile(
      path.join(rootDirectory, 'remix.init', 'gitignore'),
      path.join(rootDirectory, '.gitignore'),
    ),
  ])
  spinner.succeed('Replace names')

  spinner = ora('🏃‍♀️ Initializing git repository').start()
  await exec(`git init`, { cwd: rootDirectory })
  spinner.succeed('Git initialized')

  spinner = ora('🏃‍♀️ Running setup').start()
  await exec(`npm run setup`, { cwd: rootDirectory })
  spinner.succeed('Setup complete')

  spinner = ora('🏃‍♀️ Validating code').start()
  await exec(`git add . && git commit -m "initial commit"`, {
    stdio: 'ignore',
    cwd: rootDirectory,
  })
  spinner.succeed('Code validated')

  console.log(
    `Setup is complete. You're now ready to rock and roll 🤘
Start development with \`pnpm dev\`
    `.trim(),
  )
}

init()
