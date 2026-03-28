import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure' // Not 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Savanah-kitchen',
  projectId: 'lay5wr49',
  dataset: 'production',
  basePath: '/studio', 
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})