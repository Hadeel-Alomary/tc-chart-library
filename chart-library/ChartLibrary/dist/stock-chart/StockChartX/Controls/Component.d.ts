export interface IDestroyable {
    destroy(): void;
}
export interface IComponent extends IDestroyable {
}
export declare abstract class Component implements IComponent {
    abstract destroy(): void;
}
//# sourceMappingURL=Component.d.ts.map