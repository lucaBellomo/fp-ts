# Introduzione alla Programmazione Funzionale


La programmazione funzionale è un paradigma di programmazione che si concentra sull'uso di funzioni pure e sull'evitare lo stato condiviso e i dati mutabili. Promuove la scrittura di codice dichiarativo e componibile, migliorando la leggibilità e la manutenibilità del codice.


---


# Concetti di Base


- **Immutabilità**: Garantisce che i dati non cambino dopo essere stati creati, promuovendo la stabilità e la prevedibilità del codice.
- **Purezza**: Le funzioni restituiscono lo stesso risultato per gli stessi input, senza effetti collaterali, rendendo più facile la comprensione e il testing del codice.
- **Funzioni di Ordine Superiore**: Possono accettare altre funzioni come argomenti o restituire altre funzioni come risultati, consentendo la creazione di costrutti più complessi e flessibili.


---


# I due pilastri della programmazione funzionale

- **Trasparenza referenziale** 
- **Composizione** come design pattern universale


## Trasparenza referenziale

Definition. An expression is said to be referentially transparent if it can be replaced with its corresponding value without changing the program's behavior

Esempio (la trasparenza referenziale implica l'uso di funzioni pure)

```
const double = (n: number): number => n * 2
const x = double(2)
const y = double(2)
```
L'espressione double(2) gode della proprietà di trasparenza referenziale perché posso sostituirla con il suo valore 4.

Posso perciò tranquillamente procedere con il seguente refactoring
```
const x = 4
const y = x
```
Non tutte le espressioni godono della proprietà di trasparenza referenziale, vediamo qualche esempio

Esempio (la trasparenza referenziale implica non lanciare eccezioni)
```
const inverse = (n: number): number => {
if (n === 0) throw new Error('cannot divide by zero')
return 1 / n
}

const x = inverse(0) + 1
```
Non posso sostituire l'espressione inverse(0) con il suo valore, perciò l'espressione non gode della proprietà di trasparenza referenziale.

Esempio (la trasparenza referenziale può implicare l'utilizzo di strutture dati immutabili)
```
const xs = [1, 2, 3]

const append = (xs: Array<number>): void => {
xs.push(4)
}

append(xs)

const ys = xs
```
Nell'ultima riga non posso sostituire l'espressione xs con il suo valore iniziale [1, 2, 3] dato che il suo valore attuale è stato cambiato dalla chiamata alla funzione append.

Perché è così importante la trasparenza referenziale? Perché permette di:

ragionare localmente sul codice (ovvero non ho bisogno di conoscere un contesto più ampio per capire un frammento di codice)
rifattorizzare senza cambiare il comportamento del programma (per la definizione stessa di trasparenza referenziale)
Quiz. Supponiamo di avere il seguente programma:
```
// In TypeScript `declare` permette di introdurre una definizione senza specificarne l'implementazione.
declare const question: (message: string) => Promise<string>

const x = await question('What is your name?')
const y = await question('What is your name?')
```
Posso rifattorizzarlo in questo modo? Il comportamento del programma è lo stesso o è cambiato?
```
const x = await question('What is your name?')
const y = x
```
Come potete vedere il refactoring di un programma che contiene espressioni che non godono della proprietà di trasparenza referenziale va affontato con molta cautela. Nella programmazione funzionale, ove ogni espressione gode della proprietà di trasparenza referenziale, il carico cognitivo in fase di refactoring è ridotto.

Parliamo ora del secondo pilastro, la composizione.

## Composizione
Il pattern fondamentale della programmazione funzionale è la componibilità, ovvero la costruzione di piccole unità che fanno qualcosa di specifico in grado di essere combinate tra loro al fine di ottenere entità più grandi e complesse.

Come esempi, e in un percorso dal "più piccolo al più grande", possiamo pensare:

alla composizione di due semplici valori (come due numeri o due stringhe)
oppure alla composizione di funzioni
o anche alla composizione di interi programmi
In questo ultimo caso possiamo parlare di "programmazione modulare":


Vediamo nella pratica come è possibile tendere verso questo stile di programmazione attraverso l'uso di quelli che vengono chiamati combinatori.


Il concetto di combinatore è piuttosto sfumato e si può presentare in diverse forme, ma la sua forma più semplice è questa:

combinator: Thing -> Thing
Esempio. Possiamo pensare alla funzione double come ad un combinatore di numeri.

Lo scopo di un combinatore è quello di creare nuove "cose" da "cose" definite precedentemente.

Notate che il risultato del combinatore può essere nuovamente passato come input, si ottiene perciò una esplosione combinatoria di possibilità, il che rende questo pattern molto potente.

Esempio
```
import { pipe } from 'fp-ts/function'

const double = (n: number): number => n * 2

console.log(pipe(2, double, double, double)) // => 16
```
Perciò il design generale che potete spesso trovare in un modulo funzionale è questo:

un modello per T
un insieme di semplici "primitive" di tipo T
un insieme di combinatori per combinare le primitive in strutture più complesse


# Tipi di Dati 


I tipi di dati algebraici come enum, union e record sono essenziali nella programmazione funzionale. Consentono di modellare dati complessi in modi più precisi e sicuri rispetto ai tipi primitivi. Ad esempio:


```typescript
type Option<A> = None | Some<A>;


interface None {
  _tag: 'None';
}


interface Some<A> {
  _tag: 'Some';
  value: A;
}
```


---


# Pattern Matching


Il pattern matching è una tecnica per estrarre dati da strutture complesse in modo conciso e leggibile. È spesso usato con union e record per gestire diversi casi in modo elegante. Esempio:


```typescript
const greet = (name: Option<string>): string =>
  match(name, {
    None: () => 'Hello, anonymous!',
    Some: ({ value }) => `Hello, ${value}!`
  });
```


---

# Strutture algebriche: Magma, Semigruppi e Monadi

## Magma

Un Magma è una struttura algebrica che consiste in un insieme e un'operazione binaria definita su di esso. L'operazione binaria non deve necessariamente essere associativa. Formalmente, un Magma è definito come una coppia (S, *) dove S è un insieme e * è un'operazione binaria che accetta due elementi di S e restituisce un altro elemento di S.

Esempio:
Considera l'insieme degli interi e l'operazione di concatenazione di stringhe come operazione binaria. Questo forma un Magma, poiché l'operazione di concatenazione di stringhe è definita per tutti gli elementi dell'insieme degli interi.

## Semigroup

Un Semigroup è una struttura algebrica simile a un Magma, ma con l'aggiunta di un'operazione binaria associativa. Formalmente, un Semigroup è una coppia (S, *) dove S è un insieme e * è un'operazione binaria associativa su S.

Esempio:
Considera l'insieme degli interi e l'operazione di somma come operazione binaria. Questo forma un Semigroup, poiché l'operazione di somma è associativa per tutti gli elementi dell'insieme degli interi.

## Monadi

Le Monadi sono strutture algebriche più complesse che emergono nella programmazione funzionale. Sono utilizzate per rappresentare computazioni con effetti laterali o computazioni asincrone. Una monade è composta da tre componenti principali: una struttura di dati che rappresenta il risultato della computazione, una funzione per incapsulare valori all'interno della monade (unit/return), e una funzione per comporre computazioni sequenziali (bind/join).

Le monadi sono utili per gestire effetti collaterali come l'input/output, gestire le eccezioni, e gestire operazioni asincrone come le Promise.

Esempio:
Considera una monade che rappresenta una computazione asincrona come una Promise in JavaScript. La monade avrà una struttura di dati che rappresenta il risultato della Promise, una funzione per incapsulare valori all'interno della Promise (Promise.resolve) e una funzione per comporre computazioni sequenziali (then/catch).
---

Ecco delle implementazioni di Magma, Semigroup e Monadi utilizzando la libreria fp-ts:

### Magma

```typescript
import { Magma } from 'fp-ts/lib/Magma';

// Definizione di un Magma per la concatenazione di stringhe
const stringConcatMagma: Magma<string> = {
  concat: (x, y) => x + y
};

// Utilizzo del Magma per concatenare due stringhe
const result: string = stringConcatMagma.concat('Hello, ', 'world!');
console.log(result); // Output: Hello, world!
```

### Semigroup

```typescript
import { Semigroup } from 'fp-ts/lib/Semigroup';

// Definizione di un Semigroup per la somma di numeri
const sumSemigroup: Semigroup<number> = {
  concat: (x, y) => x + y
};

// Utilizzo del Semigroup per sommare una lista di numeri
const numbers: number[] = [1, 2, 3, 4, 5];
const sum: number = numbers.reduce(sumSemigroup.concat, 0);
console.log(sum); // Output: 15
```

### Monadi

```typescript
import { task, Task } from 'fp-ts/lib/Task';
import { map } from 'fp-ts/lib/Task';

// Definizione di una monade Task per rappresentare una computazione asincrona
const asyncComputation: Task<number> = task.of(42);

// Utilizzo della monade Task per eseguire una computazione asincrona
asyncComputation().then(result => {
  console.log(result); // Output: 42
});

// Mapping di una monade Task
const asyncSquared: Task<number> = map(asyncComputation, x => x * x);

// Utilizzo della monade Task mappata
asyncSquared().then(result => {
  console.log(result); // Output: 1764 (42 * 42)
});
```


---


# Libreria fp-ts: Principali Funzionalità

## Introduzione
La libreria fp-ts è una libreria per la programmazione funzionale in TypeScript che offre una serie di tipi e funzioni per facilitare lo sviluppo di codice robusto e manutenibile. Di seguito sono elencate alcune delle principali funzionalità offerte da fp-ts, insieme ad esempi di codice per illustrarle.

## Monadi utili

### Option
L'Option type rappresenta un valore che potrebbe o potrebbe non essere presente. È utile per gestire situazioni in cui un valore potrebbe essere null o undefined.

```typescript
import { Option, some, none } from 'fp-ts/lib/Option';

const maybeString: Option<string> = some('Hello');
const maybeNumber: Option<number> = none;

// Utilizzo della Option type
const greetingLength: Option<number> = some('Hello').map(s => s.length);
```

### Either
Il tipo Either rappresenta un valore che può essere uno di due tipi distinti. È spesso utilizzato per gestire risultati che possono essere sia corretti che errati.

```typescript
import { Either, left, right } from 'fp-ts/lib/Either';

const eitherNumberOrString: Either<number, string> = right('Hello');
const eitherErrorOrValue: Either<Error, number> = left(new Error('An error occurred'));

// Utilizzo della Either type
const parseNumber = (input: string): Either<Error, number> => {
  const parsed = parseInt(input, 10);
  return isNaN(parsed) ? left(new Error('Invalid number')) : right(parsed);
};
```

## Funzioni

### Map
La funzione map applica una funzione a un valore incapsulato in un tipo monadico come Option o Either.

```typescript
import { map } from 'fp-ts/lib/Option';

const maybeString: Option<string> = some('Hello');
const maybeStringLength: Option<number> = map(maybeString, s => s.length);
```

### Pipe
La funzione pipe consente di comporre funzioni in modo leggibile da sinistra a destra.

```typescript
import { pipe } from 'fp-ts/lib/function';

const addOne = (x: number): number => x + 1;
const double = (x: number): number => x * 2;

const addOneAndDouble = pipe(addOne, double);
console.log(addOneAndDouble(3)); // Output: 8
```

### Fold
La funzione fold è utile per estrarre valori da un tipo monadico come Option o Either in modo sicuro.

```typescript
import { fold } from 'fp-ts/lib/Either';

const result: Either<Error, number> = parseNumber('10');
const value: number = fold(
  error => {
    console.error('An error occurred:', error.message);
    return 0;
  },
  value => value
)(result);
console.log('Parsed number:', value); // Output: Parsed number: 10
```

## Monadi

### Task
Il tipo Task rappresenta un'azione asincrona. È utile per gestire operazioni asincrone in modo componibile.

```typescript
import { Task, task } from 'fp-ts/lib/Task';

const myTask: Task<number> = () => Promise.resolve(42);

myTask().then(console.log); // Output: 42
```

### Option come Monade
L'Option type può essere trattata come una monade, consentendo di concatenare operazioni in modo sicuro.

```typescript
import { chain } from 'fp-ts/lib/Option';

const maybeString: Option<string> = some('Hello');
const maybeUpperCase: Option<string> = chain(maybeString, s => some(s.toUpperCase()));
```

## Conclusioni
La libreria fp-ts offre una serie di strumenti potenti per la programmazione funzionale in TypeScript. Le funzionalità descritte sopra sono solo alcune delle principali offerte dalla libreria. Utilizzando fp-ts, è possibile scrivere codice più sicuro, componibile e manutenibile in TypeScript.

Per ulteriori informazioni e esempi, consulta la documentazione ufficiale della libreria fp-ts: [https://gcanti.github.io/fp-ts/](https://gcanti.github.io/fp-ts/)





