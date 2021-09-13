import {ModuleDeclaration, Project, SourceFile} from "ts-morph";
import {findClassesByDecorators} from "./utils";

export async function ParseEvents(project: Project, generated: SourceFile, module: ModuleDeclaration, verbose: boolean) {
    generated.addImportDeclaration({
        namedImports: ['EventBus'],
        moduleSpecifier: '@nestjs/cqrs'
    });
    const eventBusDeclaration = module.addClass({
        isExported: true,
        name: 'EventBus'
    });

    const EVENT_HANDLER_DECORATOR = 'EventsHandler';

    const eventHandlers = findClassesByDecorators(project, EVENT_HANDLER_DECORATOR);

    eventHandlers.forEach(eventHandler => {
        const event = eventHandler.getDecorator(EVENT_HANDLER_DECORATOR)?.getCallExpression()?.getArguments()[0];
        if (!event) return;

        if (verbose) {
            console.log(`Add entry for EventBus::${event.getText()}`);
        }

        eventBusDeclaration.addMethod({
            name: 'publish',
            parameters: [{
                name: 'event',
                type: writer => writer.write(event.getText())
            }],
        });
    });
}
