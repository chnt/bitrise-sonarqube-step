#!/usr/bin/env zx

const coverageFilePath = 'tests.output'

export function writeConfiguration(config) {
    console.log('Flutter.writeConfiguration() -> Generating configuration...')
    let configuration = []

    configuration.push(`sonar.projectKey=${config.project_key}`)
    configuration.push(`sonar.sources =.`)
    configuration.push(`sonar.login = ${config.sonar_token}`)
    configuration.push(`sonar.c.file.suffixes = -`)
    configuration.push(`sonar.cpp.file.suffixes = -`)
    configuration.push(`sonar.objc.file.suffixes = -`)
    configuration.push(`sonar.flutter.coverage.reportPath = ${coverageFilePath}`)
    configuration.push(`sonar.host.url = https://sonar.monstarlab.io`)
    
    if (process.env.sonar_exclusions) {
        configuration.push(`sonar.exclusions = "**/nstack.dart,**/*.g.dart,**/*.freezed.dart, ${process.env.sonar_exclusions}"`)
    } else {
        configuration.push(`sonar.exclusions = "**/nstack.dart,**/*.g.dart,**/*.freezed.dart"`)
    }
    
    if (process.env.sonar_coverage_exclusions) {
        configuration.push(`sonar.coverage.exclusions = ${process.env.sonar_coverage_exclusions}`)
    }

    if (process.env.build_string && process.env.build_string.toString().length > 0) {
        configuration.push(`sonar.buildString = ${process.env.build_string}`)
    }

    configuration.push(`sonar.projectVersion = ${config.project_version}`)
    
    if (config.coverage_path) {
        configuration.push(`sonar.coverageReportPaths = "${config.coverage_path}"`)
    }

    fs.outputFileSync(config.file_output, configuration.join('\n'))
    console.log('Flutter.writeConfiguration() -> Done')
}

export async function preScan() {
    console.log(`Generating coverage file: ${coverageFilePath}`)
    await $`flutter test — machine — coverage > ${coverageFilePath}`
}