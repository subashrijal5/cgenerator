import * as fs from 'fs'
import * as prompts from 'prompts'

const envFilePath = '.env'
const envVariables: { [key: string]: string } = {}

async function askQuestion(
  envKey: string,
  question: string,
  options?: prompts.Choice[],
  initial?: string
) {
  let answer
  if (options && options.length > 0 && options != undefined) {
    answer = await prompts({
      type: 'select',
      name: envKey,
      message: question,
      choices: options,
      initial: initial
    })
  } else {
    answer = await prompts({
      type: 'text',
      name: envKey,
      message: question
    })
  }

  envVariables[envKey] = answer[envKey]
}

const confirmOverwrite = async () => {
  if (fs.existsSync(envFilePath)) {
    const overwrite = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'You already have a .env file. Do you want to overwrite your .env file?'
    })
    if (!overwrite.overwrite) {
      console.info('Exiting...')
      process.exit(0)
    }
  }
}


export type ComponentCases = 'camel' | 'pascal' | 'snake' |'title' | 'kebab'

export const StartSetup = async () => {
  await confirmOverwrite()

  console.info('We are currently in beta version and may not support to all frameworks.')
  console.info('Please make sure you have a .env file in the root directory.')
  console.info('If you do not have one, we will create one for you.')
  console.info('If you have one, we will update it for you.')
  console.info('We will deliver support for all framework very soon. Stay updated. ')

  await askQuestion('FRAMEWORK', 'Which framework are you using currently?', [
    { title: 'React', value: 'react' },
    { title: 'Vue', value: 'vue' },
    { title: 'Angular', value: 'angular' },
    { title: 'Svelte', value: 'svelte' },
    { title: 'Other', value: 'other' }
  ])
  await askQuestion(
    'COMPONENT_BASE_PATH',
    'What is your component base path?',
    undefined,
    'src/components'
  )
  await askQuestion(
    'COMPONENT_NAME_PREFIX',
    'What is your component name prefix?',
    undefined,
    'MyComponent'
  )
  await askQuestion(
    'COMPONENT_NAME_SUFFIX',
    'What is your component name suffix?',
    undefined,
    'Component'
  )
  await askQuestion('COMPONENT_NAME_CASE', 'What is your component name case?', [
    { title: 'Camel Case', value: 'camel' },
    { title: 'Pascal Case', value: 'pascal' },
    { title: 'Snake Case', value: 'snake' },
    { title: 'Title Case', value: 'title' },
    { title: 'Kebab Case', value: 'kebab' }
  ])
  await askQuestion('COMPONENT_EXTENSION', 'What is your component extension?', [
    { title: 'TSX', value: 'tsx' },
    { title: 'JSX', value: 'jsx' },
    { title: 'JS', value: 'js' },
    { title: 'TS', value: 'ts' },
    { title: 'Vue', value: 'vue' },
    { title: 'Svelte', value: 'svelte' }
  ])

  // serialize the environment variables to a string
  const envContents = Object.entries(envVariables)
    .map(([key, value]) => value && `${key}=${value}`)
    .join('\n')

  console.info('Writing environment variables to .env file')
  // write the environment variables to a file
  fs.writeFileSync(envFilePath, envContents)
  console.log('Starting developing now. ')
}
