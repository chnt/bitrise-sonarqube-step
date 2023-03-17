#!/usr/bin/env zx

import * as ios from './ios.mjs'
import * as android from './android.mjs'

let config = {
    platform: 'ios',
    file_output: 'sonar-project.properties',
    sonar_token: process.env.sonar_token?.toString() || '',
    project_key: process.env.project_key?.toString() || process.env.BITRISE_APP_TITLE?.toString(),
    coverage_path: process.env.coverage_path?.toString() || '',
    project_version: process.env.project_version?.toString() || '',
    scannerDir: '',
    scannerVersion: process.env.scanner_version?.toString() || '4.8.0.2856'
}

async function downloadScanner() {
    config.scannerDir = await $`mktemp -d`
    let currentDir = await $`pwd`
    await $`cd ${config.scannerDir} && \
    pwd && \
    wget 'https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${config.scannerVersion}.zip' && \
    unzip "sonar-scanner-cli-${config.scannerVersion}.zip"`
    await $`cd ${currentDir}`
}

function determinePlatform() {
    if (process.env.platform.toString() === 'auto') {
        let buildSlug = process.env.BITRISE_APP_TITLE
        let platform = buildSlug.split('-').slice(-1).toString()
        console.log('Found platform: ' + platform)
        config.platform = platform
    } else {
        config.platform = process.env.platform.toString()
    }   
}

async function runPlatform() {
    switch(config.platform) {
        case 'ios':
            ios.preScan()
            ios.writeConfiguration(config)
        break;
        case 'android':
            android.preScan()
            android.writeConfiguration(config)
            break;
        default:
            console.log('default')
            break;
    }
}

async function runScan() {
    await $`${config.scannerDir}/sonar-scanner-${config.scannerVersion}/bin/sonar-scanner`
}

await downloadScanner()
determinePlatform()
await runPlatform()
await runScan()


