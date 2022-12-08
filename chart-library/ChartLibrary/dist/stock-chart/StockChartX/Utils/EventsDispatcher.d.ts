import { EventHandler, IEventObject } from "./EventableObject";
export declare class EventsDispatcher {
    private _listeners;
    on(eventNames: string, handler: EventHandler, target?: Object): void;
    off(eventNames: string, target?: Object): void;
    private _off;
    fire(eventName: string, event?: IEventObject): void;
}
//# sourceMappingURL=EventsDispatcher.d.ts.map