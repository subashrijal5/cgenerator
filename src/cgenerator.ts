#!/usr/bin/env node
import { initGenerate } from './scripts'

initGenerate().catch(err => console.error(err))
