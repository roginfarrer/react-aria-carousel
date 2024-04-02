import React from 'react';
export declare function getInputOnChange<T>(setValue: (value: null | undefined | T | ((current: T) => T)) => void): (val: T | React.ChangeEvent<any> | ((current: T) => T) | null | undefined) => void;
export declare function useInputState<T>(initialState: T): [T, (value: null | undefined | T | React.ChangeEvent<any>) => void];
