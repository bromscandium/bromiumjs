/**
 * Dependency tracking system for reactive state management.
 * Uses WeakMap for automatic garbage collection of unused dependencies.
 * @module
 */
/**
 * An effect function that can be tracked and re-executed when dependencies change.
 */
export type EffectFn = (() => void) & {
    deps: Set<Set<EffectFn>>;
    options?: EffectOptions;
};
/**
 * Configuration options for reactive effects.
 */
export interface EffectOptions {
    /** If true, the effect will not run immediately upon creation */
    lazy?: boolean;
    /** Custom scheduler function to control when the effect runs */
    scheduler?: (fn: EffectFn) => void;
}
/**
 * Returns the currently executing effect, if any.
 *
 * @returns The active effect function or null if no effect is running
 */
export declare function getActiveEffect(): EffectFn | null;
/**
 * Sets the currently active effect.
 *
 * @param effect - The effect to set as active, or null to clear
 */
export declare function setActiveEffect(effect: EffectFn | null): void;
/**
 * Pushes an effect onto the effect stack and sets it as active.
 * Used internally when running nested effects.
 *
 * @param effect - The effect to push onto the stack
 */
export declare function pushEffect(effect: EffectFn): void;
/**
 * Pops the current effect from the stack and restores the previous active effect.
 * Used internally when a nested effect completes.
 */
export declare function popEffect(): void;
/**
 * Tracks a dependency between the currently active effect and a reactive property.
 * Called automatically when a reactive property is accessed during effect execution.
 *
 * @param target - The reactive object being accessed
 * @param key - The property key being accessed
 *
 * @example
 * ```ts
 * // Typically called internally by reactive proxies
 * track(state, 'count');
 * ```
 */
export declare function track(target: object, key: string | symbol): void;
/**
 * Triggers all effects that depend on a reactive property.
 * Called automatically when a reactive property is modified.
 *
 * @param target - The reactive object being modified
 * @param key - The property key being modified
 *
 * @example
 * ```ts
 * // Typically called internally by reactive proxies
 * trigger(state, 'count');
 * ```
 */
export declare function trigger(target: object, key: string | symbol): void;
/**
 * Removes an effect from all its dependency sets.
 * Called before re-running an effect to ensure fresh dependency tracking.
 *
 * @param effect - The effect to clean up
 */
export declare function cleanup(effect: EffectFn): void;
//# sourceMappingURL=dep.d.ts.map