import {Project} from "ts-morph";

export function GenerateProject(tsconfig: string, srcs: string): Project {
    const project = new Project({
        tsConfigFilePath: tsconfig,
        skipAddingFilesFromTsConfig: true,
    });

    project.addSourceFilesAtPaths(srcs);
    return project;
}
