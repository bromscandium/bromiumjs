/**
 * Dependency tracking system for reactive state management.
 * Uses WeakMap for automatic garbage collection of unused dependencies.
 * @module
 */
const targetMap = new WeakMap();
let activeEffect = null;
const effectStack = [];
/**
 * Returns the currently executing effect, if any.
 *
 * @returns The active effect function or null if no effect is running
 */
export function getActiveEffect() {
    return activeEffect;
}
/**
 * Sets the currently active effect.
 *
 * @param effect - The effect to set as active, or null to clear
 */
export function setActiveEffect(effect) {
    activeEffect = effect;
}
/**
 * Pushes an effect onto the effect stack and sets it as active.
 * Used internally when running nested effects.
 *
 * @param effect - The effect to push onto the stack
 */
export function pushEffect(effect) {
    effectStack.push(effect);
    activeEffect = effect;
}
/**
 * Pops the current effect from the stack and restores the previous active effect.
 * Used internally when a nested effect completes.
 */
export function popEffect() {
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1] || null;
}
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
export function track(target, key) {
    if (!activeEffect)
        return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let deps = depsMap.get(key);
    if (!deps) {
        depsMap.set(key, (deps = new Set()));
    }
    if (!deps.has(activeEffect)) {
        deps.add(activeEffect);
        activeEffect.deps.add(deps);
    }
}
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
export function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    const deps = depsMap.get(key);
    if (!deps)
        return;
    const effectsToRun = new Set();
    deps.forEach(effect => {
        if (effect !== activeEffect) {
            effectsToRun.add(effect);
        }
    });
    effectsToRun.forEach(effect => {
        if (effect.options?.scheduler) {
            effect.options.scheduler(effect);
        }
        else {
            effect();
        }
    });
}
/**
 * Removes an effect from all its dependency sets.
 * Called before re-running an effect to ensure fresh dependency tracking.
 *
 * @param effect - The effect to clean up
 */
export function cleanup(effect) {
    effect.deps.forEach(deps => {
        deps.delete(effect);
    });
    effect.deps.clear();
}
//# sourceMappingURL=dep.js.map