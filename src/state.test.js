import { snapshot_UNSTABLE } from 'recoil'
import {
  codeState,
  encodedQuoteState,
  guessState,
  quotesState,
  winningState,
} from './state'

describe('encodeQuoteState', () => {
  it('correctly encodes quotes', () => {
    const quote = 'ab c,d!'
    const code = {
      A: 'W',
      B: 'X',
      C: 'Y',
      D: 'Z',
    }
    const encoded = 'WX Y,Z!'
    const snapshot = snapshot_UNSTABLE(({ set }) => {
      set(quotesState, [
        {
          quote: quote,
          author: 'me',
        },
      ])
      set(codeState, code)
    })
    expect(
      snapshot.getLoadable(encodedQuoteState).valueOrThrow()
    ).toStrictEqual([
      {
        author: 'me',
        quote: encoded,
      },
    ])
  })
})

describe('winningState', () => {
  it('is false when user has not won', () => {
    const quote = 'abcd'
    const code = {
      A: 'W',
      B: 'X',
      C: 'Y',
      D: 'Z',
    }
    const guesses = {
      W: 'A',
      X: 'B',
      Y: 'C',
      Z: ' ', //incorrect guess
    }
    const snapshot = snapshot_UNSTABLE(({ set }) => {
      set(quotesState, [
        {
          quote: quote,
          author: 'me',
        },
      ])
      set(codeState, code)
      set(guessState, guesses)
    })
    expect(snapshot.getLoadable(winningState).valueOrThrow()).toBe(false)
  })

  it('is true when user guesses the code', () => {
    const quote = 'abcd'
    const code = {
      A: 'W',
      B: 'X',
      C: 'Y',
      D: 'Z',
    }
    const guesses = {
      W: 'A',
      X: 'B',
      Y: 'C',
      Z: 'D',
    }
    const snapshot = snapshot_UNSTABLE(({ set }) => {
      set(quotesState, [
        {
          quote: quote,
          author: 'me',
        },
      ])
      set(codeState, code)
      set(guessState, guesses)
    })
    expect(snapshot.getLoadable(winningState).valueOrThrow()).toBe(true)
  })
})
