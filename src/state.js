import { atom, selector } from 'recoil'
import initialData from './data'
import { isLetter } from './utils'

const quotesState = atom({
  key: 'quotesState',
  default: initialData.quotes,
})

const codeState = atom({
  key: 'codeState',
  default: initialData.code,
})

const guessState = atom({
  key: 'guessState',
  default: initialData.guesses,
})

const encodedQuoteState = selector({
  key: 'encodedQuoteState',
  get: ({ get }) => {
    const quotes = get(quotesState)
    const encodedQuotes = []
    const code = get(codeState)
    for (const quote of quotes) {
      encodedQuotes.push({
        author: quote.author,
        quote: quote.quote
          .split('')
          .map((char) => {
            if (isLetter(char)) return code[char.toUpperCase()]
            return char
          })
          .join(''),
      })
    }
    return encodedQuotes
  },
})

const winningState = selector({
  key: 'winningState',
  get: ({ get }) => {
    const quotes = get(quotesState)
    const encodedQuotes = get(encodedQuoteState)
    const guesses = get(guessState)
    for (const [index, quote] of quotes.entries()) {
      const decodedQuote = encodedQuotes[index].quote
        .split('')
        .map((char) => {
          if (isLetter(char)) return guesses[char.toUpperCase()]
          return char
        })
        .join('')
      if (decodedQuote !== quote.quote.toUpperCase()) return false
    }
    return true
  },
})

export { encodedQuoteState, codeState, guessState, quotesState, winningState }
