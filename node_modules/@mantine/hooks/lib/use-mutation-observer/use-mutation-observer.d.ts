import { RefObject } from 'react';
export declare function useMutationObserver<Element extends HTMLElement>(callback: MutationCallback, options: MutationObserverInit, target?: HTMLElement | (() => HTMLElement) | null): RefObject<Element>;
