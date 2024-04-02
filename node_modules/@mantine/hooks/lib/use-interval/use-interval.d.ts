export declare function useInterval(fn: () => void, interval: number): {
    start: () => void;
    stop: () => void;
    toggle: () => void;
    active: boolean;
};
