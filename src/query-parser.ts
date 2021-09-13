import {ModuleDeclaration, Project, SourceFile} from "ts-morph";
import {findClassesByDecorators} from "./utils";

export async function ParseQueries(project: Project, generated: SourceFile, module: ModuleDeclaration, verbose: boolean) {
    generated.addImportDeclaration({
        namedImports: ['QueryBus'],
        moduleSpecifier: '@nestjs/cqrs'
    });
    const queryBusDeclaration = module.addClass({
        isExported: true,
        name: 'QueryBus'
    });

    const QUERY_HANDLER_DECORATOR = 'QueryHandler';

    const queryHandlers = findClassesByDecorators(project, QUERY_HANDLER_DECORATOR);

    queryHandlers.forEach(queryHandler => {
        const query = queryHandler.getDecorator(QUERY_HANDLER_DECORATOR)?.getCallExpression()?.getArguments()[0];
        const returnType = queryHandler.getMethod('execute')?.getReturnType().getTypeArguments()[0];
        if (!query || !returnType) return;

        if(verbose) {
            console.log(`Add entry for QueryBus::${query.getText()}`);
        }

        queryBusDeclaration.addMethod({
            name: 'execute',
            parameters: [{
                name: 'query',
                type: writer => writer.write(query.getText())
            }],
            returnType: writer => writer.write(`Promise<${returnType.getText()}>`)
        });
    });
}
