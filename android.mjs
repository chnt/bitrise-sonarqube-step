#!/usr/bin/env zx

export function writeConfiguration(config) {
    console.log('Android.writeConfiguration() -> Generating configuration...')
    let configuration = []

    configuration.push(`sonar.projectKey=${config.project_key}`)
    configuration.push(`sonar.sources =.`)
    configuration.push(`sonar.login = ${config.sonar_token}`)
    configuration.push(`sonar.binaries = **/build/intermediates/javac/*/classes`)
    configuration.push(`sonar.java.binaries = **/build/intermediates/javac/*/classes`)
    configuration.push(`sonar.c.file.suffixes = -`)
    configuration.push(`sonar.cpp.file.suffixes = -`)
    configuration.push(`sonar.objc.file.suffixes = -`)
    configuration.push(`sonar.host.url = https://sonar.monstarlab.io`)
    
    if (process.env.sonar_exclusions) {
        configuration.push(`sonar.exclusions = "**/Translation.java, ${process.env.sonar_exclusions}"`)
    } else {
        configuration.push(`sonar.exclusions = "**/Translation.java"`)
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
    console.log('Android.writeConfiguration() -> Done')
}

export async function preScan() {
    
}