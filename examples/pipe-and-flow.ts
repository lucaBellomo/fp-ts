// Pipe
// A f-> B g-> C

import {pipe, flow} from 'fp-ts/function'

const size = (s: string) => s.length

pipe(
    'hello',
    size // 5
)

const isAtLeast3 = (n: number) => n >= 3

pipe(
    'hello',
    size, // 5
    isAtLeast3, // true
)

const trim = (s: string) => s.trim()

pipe(
    ' hi ',
    trim,
    size, // 2,
    isAtLeast3 // false
)

const isValid = (s: string): boolean => pipe(
    ' hi ',
    trim,
    size, // 2,
    isAtLeast3 // false
)

// Implementation
const pipe1 = <A, B, C>(
    a: A,
    f: (a: A) => B,
    g: (b: B) => C
): C => g(f(a))


// ---
// FLOW
// flow(f,g) -> h


const isLongEnough = flow(size, isAtLeast3)

isLongEnough('hello') // true

const isValid1 = flow(trim, size, isAtLeast3)

isValid1('hello');

// la prima funzione può accettare più parametri, le successive solo uno (funzioni unarie)

const concat = (s1: string, s2: string) => s1 + s2

const isValid2 = flow(concat, trim, size, isAtLeast3)


// Implementation
const flow1 = <A, B, C>(
    f: (a: A) => B,
    g: (b: B) => C,
) => (a: A): C =>
    g(f(a))
