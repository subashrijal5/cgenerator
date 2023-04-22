import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import { ComponentCases } from '../general'

type EnvDataType = { [key: string]: string }

export const initGenerate = async () => {
  const envData = await getEnvironmentData()
  await verifyCreateComponentDirectory(envData)

  const templates = await getTemplates(envData.COMPONENT_EXTENSION)
  const stubVariables = await getComponentStubVariables(envData)

  const generatedComponent = await generateComponent(templates.component, stubVariables)
  const generatedTest = await generateComponent(templates.test, stubVariables)
  await createComponent({component: generatedComponent, test: generatedTest}, envData, stubVariables.model)
}

const getEnvironmentData = async () => {
  const envData = dotenv.config()
  if (envData.error) {
    console.error(envData.error)
    process.exit(1)
  }
  return envData.parsed as EnvDataType
}

/**
 * Get the templates for the selected extension
 * @param framework
 */
const getTemplates = async (extension: string) => {
  const basePath = path.resolve(__dirname, `../../templates/${extension}`)
  const testTemplate = fs.readFileSync(`${basePath}/component.test.template`, 'utf8')
  const componentTemplate = fs.readFileSync(`${basePath}/component.template`, 'utf8')
  return { test: testTemplate, component: componentTemplate }
}

const getModelName = async (envData: EnvDataType) => {
  const inputName = process.argv[2] || process.env.npm_config_component
  if (!inputName && typeof inputName !== 'string') {
    console.error('Please provide a component name')
    console.log('For example. npm make:component Post  or npm run make:component --component=Post')
    process.exit(1)
  }
  //  convert name into case specified in env adding prefix and suffix as per env
  const componentCase = envData.COMPONENT_NAME_CASE as ComponentCases
  const componentPrefix = envData.COMPONENT_NAME_PREFIX || ''
  const componentSuffix = envData.COMPONENT_NAME_SUFFIX || ''
  const name = `${componentPrefix}${inputName}${componentSuffix}`
  switch (componentCase) {
    case 'camel':
      return name.replace(/-([a-z])/g, (match, char) => char.toUpperCase())
    case 'pascal':
      return name.replace(/(^\w|-\w)/g, match => match.toUpperCase().replace('-', ''))
    case 'snake':
      return name.replace(/-/g, '_')
    case 'kebab':
      return name
    case 'title':
      return name.replace(/(^\w|-\w)/g, match => match.toUpperCase().replace('-', ' '))
    default:
      return name
  }
}

const getComponentStubVariables = async (envData: EnvDataType) => {
  return {
    model: await getModelName(envData)
  }
}

const generateComponent = async (template: string, variables: { [key: string]: string }) => {
  const keys = Object.keys(variables)

  let returnData = template
  // Loop through the keys and replace any instances of the key in the string with the corresponding value
  keys.forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    returnData = returnData.replace(regex, variables[key])
  })

  // Return the updated string
  return returnData
}

const createComponent = async (content:  { [key: string]: string }, envData: EnvDataType, model: string) => {
  const componentPath = path.resolve(process.cwd(), envData.COMPONENT_BASE_PATH, model)

  if (!fs.existsSync(componentPath)) {
    fs.mkdirSync(componentPath)
    fs.writeFileSync(`${componentPath}/index.${envData.COMPONENT_EXTENSION}`, content.component)
    fs.writeFileSync(`${componentPath}/${model}.test.${envData.COMPONENT_EXTENSION}`, content.test)
    console.log(`Component ${model} created successfully`)
  }
}


const verifyCreateComponentDirectory = async (envData: EnvDataType) => {
  if(!fs.existsSync(envData.COMPONENT_BASE_PATH)) {
    fs.mkdirSync(envData.COMPONENT_BASE_PATH)
  }
}

