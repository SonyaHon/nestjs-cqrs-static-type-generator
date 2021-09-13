# Static Type Generator
## Description
A command line utility to generate static types for [@nestjs/cqrs](https://github.com/nestjs/cqrs) module handlers.


## Installation
```bash
  $ npm install --save-dev nestjs-cqrs-static-type-generator
```
## Usage
```bash
  $ ./node_modules/.bin/generate-types --help
```
Will show you help menu

## Example
Based on this [example](https://github.com/kamilmysliwiec/nest-cqrs-example.git)
you will get following types generated.
```typescript
import { CommandBus, EventBus, QueryBus } from "@nestjs/cqrs";
import { DropAncientItemCommand } from "./src/heroes/commands/impl/drop-ancient-item.command";
import { KillDragonCommand } from "./src/heroes/commands/impl/kill-dragon.command";
import { HeroFoundItemEvent } from "./src/heroes/events/impl/hero-found-item.event";
import { HeroKilledDragonEvent } from "./src/heroes/events/impl/hero-killed-dragon.event";
import { GetHeroesQuery } from "./src/heroes/queries/impl";

/**
 * This file is auto-generated.
 * Please do not edit this file manually or add it
 * to your git repository as it may contain some 
 * absolute paths to class declarations
**/
declare module '@nestjs/cqrs' {
    export class QueryBus {
        execute(query: GetHeroesQuery): Promise<import("/Users/sonyahon/Workspace/SonyaHon/ex/nest-cqrs-example/src/heroes/models/hero.model").Hero[]>;
    }

    export class CommandBus {
        execute(command: DropAncientItemCommand): Promise<void>;
        execute(command: KillDragonCommand): Promise<void>;
    }

    export class EventBus {
        publish(event: HeroFoundItemEvent);
        publish(event: HeroKilledDragonEvent);
    }
}
```
This augments default types of @nestjs/cqrs providing auto-completion based on handler implementation and throw compile time errors if handler is not presented.
## License
MIT
