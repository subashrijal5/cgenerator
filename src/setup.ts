#!/usr/bin/env node
import { StartSetup } from './scripts'

StartSetup().catch(err => console.error(err))
