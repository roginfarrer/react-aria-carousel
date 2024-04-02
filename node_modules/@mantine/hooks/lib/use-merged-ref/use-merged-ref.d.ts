import { Ref } from 'react';
type PossibleRef<T> = Ref<T> | undefined;
export declare function assignRef<T>(ref: PossibleRef<T>, value: T): void;
export declare function mergeRefs<T>(...refs: PossibleRef<T>[]): (node: T | null) => void;
export declare function useMergedRef<T>(...refs: PossibleRef<T>[]): (node: T | null) => void;
export {};
