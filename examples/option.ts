// il tipo Option è usato per rappresentare valori opzionali
// se abbiamo il valore A, Option<A> è un contenitore per un valore opzionale di tipo A
// se A è presente Option<A> è un'istanza di Some<A> (wrapper che contiene il valore). Altrimenti un'istanza di None

import {pipe} from "fp-ts/function";

type Option<A> = Some<A> | None

interface None {
    _tag: 'None';
}


interface Some<A> {
    _tag: 'Some';
    value: A;
}

// esempi di utilizzo su fp-ts
import * as O from 'fp-ts/Option'

const inverse = (x: number): O.Option<number> =>
    x === 0 ? O.none : O.some(1/x)

inverse(0) // O.none
inverse(2) // O.some(0.5)

// l'errore è direttamente incluso nel tipo di ritorno

const inverse2 = (x: number): number => {
    if(x === 0) {
        throw new Error('Cannot get inverse of 0')
    }

    return 1/x
} // Non è vero che ritorna number anche se lo abbiamo specificato nella firma e il compilatore non si arrabbia

// O.match o O.fold

const getUiMessageWithInverse = (x: number): string =>
    pipe(
        x,
        inverse,
        O.match(
            () => 'Cannot get the inverse',
            (ix) => `The inverse of ${x} is ${ix}`
        )
    )

// esempio con getOrElse

const safeInverse = (x: number): number =>
    pipe(
        x,
        inverse,
        O.getOrElse(() => 0) // definisci un fallback
    )

const safeInverseW = (x: number): number | string =>
    pipe(
        x,
        inverse,
        O.getOrElseW(() => 'invalid') // definisci un fallback di tipo diverso
    )


// O.fromNullable

const val1: number | null = 3
const val2: number | null = null

O.fromNullable(val1) // O.some(3)
O.fromNullable(val2) // O.none


// map, flatten, chain

const head = <A>(as: ReadonlyArray<A>): O.Option<A> =>
    as.length === 0 ? O.none : O.some(as[0])

// getBestMovie(['An American in Rome', 'Winter Holidays']) => O.some('Best - AN AMERICAN IN ROME')

const toUppercase = (s: string) => s.toUpperCase()
const addPrefix = (s: string) => `Best - ${s}`

const getBestMovie = (titles: ReadonlyArray<string>): O.Option<string> =>
    pipe(
        titles,
        head, // O.some('An American in Rome')
        O.map(toUppercase), // O.some('AN AMERICAN IN ROME')
        O.map(addPrefix) // O.some('Best - AN AMERICAN IN ROME')
    )


const getBestMovieImperative = (titles: ReadonlyArray<string>): string => {
    const firstTitle = titles[0] // string | undefined

    if(firstTitle === undefined) {
        throw new Error(`Empty titles`)
    }

    return `Best - ${firstTitle.toUpperCase()}`
}

// Flatten

const inverseHead = (ns: ReadonlyArray<number>) =>
    pipe(
        ns,
        head,
        O.map(inverse) // Option<Option<number>>
    )

const inverseHead1 = (ns: ReadonlyArray<number>) =>
    pipe(
        ns,
        head,
        O.flatMap(inverse) // Option<number>
        // O.chain(inverse)
    )


// O.fromPredicate

type Discount = Readonly<{
    percentage: number,
    expired: boolean
}>

const isDiscountValid = (discount: Discount) =>
    !discount.expired

const getDiscountText = (discount: Discount): O.Option<string> =>
    pipe(
        discount,
        O.fromPredicate(isDiscountValid),
        O.map(({percentage}) => `${percentage}% DISCOUNT`)
    )

getDiscountText({percentage: 10, expired: false}) // O.some('10% DISCOUNT!')
getDiscountText({percentage: 20, expired: true}) // O.none


// con ridefinizione
interface Circle {
    type: 'Circle',
    radius: number
}
interface Square {
    type: 'Square',
    side: number
}

type Shape = Circle | Square

const isCircle = (s: Shape): s is Circle =>
    s.type === 'Circle'

const getCircle = O.fromPredicate(isCircle)

const circle: Shape = {type: 'Circle', radius: 3}
const square: Shape = {type: 'Square', side: 5}

getCircle(circle) // O.some(circle) typed as Option<Circle>
getCircle(square) // O.none typed as Option<Circle>


// Error Handling

// Funzione getMovieHighlight, se ha award deve ritornarlo, altrimenti: se ratingPosition <= 10 ritorna In TOP 10 at position: 3, altrimenti solamente "Released in 2023"

type Movie = Readonly<{
    title: string
    releaseYear: number
    ratingPosition: number
    award?: string
}>

const movie1: Movie = {
    title: 'Movie 1',
    releaseYear: 2023,
    ratingPosition: 1,
    award: 'Oscar',
}


const getMovieAwardHighlight = (movie: Movie) =>
    pipe(
        movie.award,
        O.fromNullable,
        O.map((award) => `Awarded with: ${award}`)
    )

const getMovieTop10Highlight = (movie: Movie) =>
    pipe(
        movie.ratingPosition,
        O.fromPredicate((rating) => rating <= 10),
        O.map((rating) => `In TOP 10 at position: ${rating}`)
    )

const getMovieHighlight = (movie: Movie): string =>
    pipe(
        movie,
        getMovieAwardHighlight,
        O.alt(() => getMovieTop10Highlight(movie)), // alt esegue una funzione se la Option precedente ritorna none
        O.getOrElse(() => `Released in ${movie.releaseYear}`)
    )
