#!/usr/bin/env zx

export function writeConfiguration(config) {
    let configuration = []

    configuration.push(`sonar.projectKey=${config.project_key}`)
    configuration.push(`sonar.sources =.`)
    configuration.push(`sonar.login = ${config.sonar_token}`)
    configuration.push(`sonar.c.file.suffixes = -`)
    configuration.push(`sonar.cpp.file.suffixes = -`)
    configuration.push(`sonar.objc.file.suffixes = -`)
    configuration.push(`sonar.host.url = https://sonar.monstarlab.io`)

    if (process.env.sonar_exclusions) {
        configuration.push(`sonar.exclusions = "**/Sources/Localizations/**, ${process.env.sonar_exclusions}"`)
    } else {
        configuration.push(`sonar.exclusions = "**/Sources/Localizations/**"`)
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

    fs.outputFileSync(config.file_output, configuration)
}

export async function preScan() {
    console.log('Fetching code coverage converter script...')
    const fileName = 'xccov-to-sonarqube-generic.sh'
    const convertedCoveragePath = 'cov.xml'
    const response = await fetch('https://raw.githubusercontent.com/SonarSource/sonar-scanning-examples/master/swift-coverage/swift-coverage-example/xccov-to-sonarqube-generic.sh')
    const fileContent = await response.text()
    fs.outputFileSync(fileName, fileContent)
    await $`chmod 755 ` + fileName;
    console.log('Done')

    console.log('Installing jq via Homebrew...')
    await $`brew install jq`

    console.log('Converting XCRESULT to generic SonarQube format...')
    await $`./${fileName} ${process.env.BITRISE_XCRESULT_PATH} > ${convertedCoveragePath}`
    config.coverage_path = convertedCoveragePath
}