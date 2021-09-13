#!/usr/bin/env node
import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";
import {GenerateProject} from "./project-generator";
import {WriteFile} from "./file-writer";
import {ParseQueries} from "./query-parser";
import {ParseCommands} from "./command-parser";
import {ParseEvents} from "./events-parser";

const options = commandLineArgs([
    {name: 'help', type: Boolean},
    {name: 'verbose', alias: 'v', type: Boolean},
    {name: 'config', alias: 'f', type: String, defaultValue: 'tsconfig.json'},
    {name: 'src', type: String, defaultValue: 'src/**/*.ts'},
    {name: 'output', alias: 'o', type: String, defaultValue: 'generated'},
    {name: 'original-types', type: Boolean, defaultValue: false},
]);

if (options.help) {
    const usage = commandLineUsage([
        {
            header: 'Static Types Generator Help:',
            content: 'This util will generate all needed overloads for @nestjs/cqrs handlers\nTypes will be generated for Queries, Commands and Events.'
        },
        {
            header: 'Options',
            optionList: [
                {
                    name: 'help',
                    typeLabel: ' ',
                    description: 'Shows this message'
                },
                {
                    name: 'verbose',
                    typeLabel: '{underline boolean}=false',
                    description: 'Show output while generating'
                },
                {
                    name: 'config',
                    typeLabel: '{underline file}=tsconfig.json',
                    description: 'TSConfig.json to be used',
                },
                {
                    name: 'src',
                    typeLabel: '{underline Regexp}=src/**/*.ts',
                    description: 'Regexp for files to parse',
                },
                {
                    name: 'output',
                    typeLabel: '{underline file}=generated',
                    description: 'Output file path without extension',
                },
                {
                    name: 'original-types',
                    typeLabel: '{underline boolean}=false',
                    description: 'Should original type declarations be emitted. If false only implemented handlers will be available. If true the generic form will be available preventing compile time check for handler availability.',
                }
            ]
        }
    ]);
    console.log(usage);
    process.exit();
}

const project = GenerateProject(options.config, options.src);
const generatedTypesFile = project.createSourceFile(`${options.output}.ts`, {}, {
    overwrite: true
});

generatedTypesFile.addStatements(writer => writer.writeLine(`
/**
 * This file is auto-generated.
 * Please do not edit this file manually or add it
 * to your git repository as it may contain some 
 * absolute paths to class declarations
**/
`));

const cqrsModule = generatedTypesFile.addModule({
    hasDeclareKeyword: true,
    name: "'@nestjs/cqrs'",
});

(async () => {
    if (options.verbose) {
        console.log(`Starting generation.\n\n - Cwd: ${process.cwd()}\n - Src RegExp: ${options.src}\n\n`);
    }
    await Promise.all([
        ParseQueries(project, generatedTypesFile, cqrsModule, options.verbose),
        ParseCommands(project, generatedTypesFile, cqrsModule, options.verbose),
        ParseEvents(project, generatedTypesFile, cqrsModule, options.verbose),
    ]);

    generatedTypesFile.fixMissingImports();
    generatedTypesFile.organizeImports();
    await WriteFile(`${options.output}.d.ts`, true, generatedTypesFile.getFullText());

    if (options.verbose) {
        console.log(`\n\nGenerated: ${options.output}.d.ts\n\nDone.`);
    }
})().catch(error => console.error(error));