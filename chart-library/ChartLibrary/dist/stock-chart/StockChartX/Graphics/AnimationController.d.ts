import { Animation } from "./Animation";
export declare namespace AnimationController {
    const _animations: Animation[];
    let _prevStartTime: number;
    function hasAnimationsToRun(): boolean;
    function contains(animation: Animation): boolean;
    function add(animation: Animation): boolean;
    function remove(animation: Animation): boolean;
}
//# sourceMappingURL=AnimationController.d.ts.map