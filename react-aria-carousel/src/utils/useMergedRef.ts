/**
 * MIT License
 *
 * Copyright (c) 2021 Vitaly Rtishchev
 * Mantine
 * https://github.com/mantinedev/mantine/blob/c087030bbc67a895cb39475b0494ed5a6dc5e7ab/packages/%40mantine/hooks/src/use-merged-ref/use-merged-ref.ts
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Ref, useCallback } from "react";

type PossibleRef<T> = Ref<T> | undefined;

export function assignRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    ref(value);
  } else if (typeof ref === "object" && ref !== null && "current" in ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

export function mergeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T | null) => {
    refs.forEach((ref) => assignRef(ref, node));
  };
}

export function useMergedRef<T>(...refs: PossibleRef<T>[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(mergeRefs(...refs), refs);
}
