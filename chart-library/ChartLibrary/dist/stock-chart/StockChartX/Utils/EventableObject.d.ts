export interface IEventObject {
    type: string;
    sender: Object;
    target: Object;
}
export interface IValueChangedEvent extends IEventObject {
    value?: unknown;
    oldValue?: unknown;
}
export interface EventHandler {
    (eventObject: IEventObject): void;
}
export interface IEventableObject {
    suppressEvents(suppress?: boolean): void;
    fire(eventType: string, event: IEventObject): void;
    fireValueChanged(eventType: string, newValue?: unknown, oldValue?: unknown): void;
}
export declare class EventableObject implements IEventableObject {
    private _eventsDispatcher;
    protected _suppressEvents: boolean;
    private _event;
    suppressEvents(suppress?: boolean): boolean;
    on(events: string, handler: EventHandler, target?: Object): EventableObject;
    off(events: string, target?: Object): EventableObject;
    fire(event: string, data: IEventObject): void;
    fireValueChanged(eventType: string, newValue?: unknown, oldValue?: unknown): void;
    fireTargetValueChanged(target: Object, eventType: string, newValue?: unknown, oldValue?: unknown): void;
}
//# sourceMappingURL=EventableObject.d.ts.map