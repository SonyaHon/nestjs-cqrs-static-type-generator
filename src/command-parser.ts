import {ModuleDeclaration, Project, SourceFile} from "ts-morph";
import {findClassesByDecorators} from "./utils";

export async function ParseCommands(project: Project, generated: SourceFile, module: ModuleDeclaration, verbose: boolean) {
    generated.addImportDeclaration({
        namedImports: ['CommandBus'],
        moduleSpecifier: '@nestjs/cqrs'
    });
    const commandBusDeclaration = module.addClass({
        isExported: true,
        name: 'CommandBus'
    });

    const COMMAND_HANDLER_DECORATOR = 'CommandHandler';

    const commandHandlers = findClassesByDecorators(project, COMMAND_HANDLER_DECORATOR);

    commandHandlers.forEach(commandHandler => {
        const command = commandHandler.getDecorator(COMMAND_HANDLER_DECORATOR)?.getCallExpression()?.getArguments()[0];
        const returnType = commandHandler.getMethod('execute')?.getReturnType().getTypeArguments()[0];
        if (!command || !returnType) return;

        if(verbose) {
            console.log(`Add entry for CommandBus::${command.getText()}`);
        }

        commandBusDeclaration.addMethod({
            name: 'execute',
            parameters: [{
                name: 'command',
                type: writer => writer.write(command.getText())
            }],
            returnType: writer => writer.write(`Promise<${returnType.getText()}>`)
        });
    });
}
