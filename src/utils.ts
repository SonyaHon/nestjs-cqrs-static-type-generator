import {ClassDeclaration, Project, SourceFile} from "ts-morph";

export function findClassesByDecorators(project: Project, decoratorName: string): ClassDeclaration[] {
    return project.getSourceFiles().flatMap(sourceFile => {
        return sourceFile.getClasses().filter(classDeclaration => {
            try {
                return !!classDeclaration.getDecorator(decoratorName) ;
            } catch (e) {
                return false;
            }
        });
    });
}
