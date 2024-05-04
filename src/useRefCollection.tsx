import {
  ReactNode,
  RefCallback,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type RefOption = { [k: string]: Element };

type RefCollection<T extends RefOption> = {
  [K in keyof T]: {
    current: T[K];
  };
};

export function createRefContext<T extends RefOption>() {
  type RefContext = {
    refs: Partial<RefCollection<T>>;
    register: <V extends keyof RefOption>(
      name: V,
      data: { current: RefOption[V] },
    ) => void;
  };

  const Context = createContext<RefContext>(undefined);

  function useRefs() {
    return useContext(Context).refs;
  }

  function useRef(name: keyof T) {
    const { register } = useContext(Context);

    const callback = useCallback(
      (instance: T[typeof name] | null) => {
        register(name, { current: instance });
      },
      [register, name],
    );

    return callback;
  }

  function RefProvider({ children }: { children: ReactNode }) {
    const [refs, setRefs] = useState<RefCollection<T>>();

    const register: RefContext["register"] = useCallback((name, data) => {
      setRefs((prev) => ({
        ...prev,
        [name]: data,
      }));
    }, []);

    const context = useMemo(
      () => ({
        register,
        refs,
      }),
      [register, refs],
    );

    return <Context.Provider value={context}>{children}</Context.Provider>;
  }

  return { RefProvider, useRef, useRefs };
}
