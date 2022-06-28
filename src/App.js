import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import './App.css';

import state from './data'

const quotesState = atom({
  key: 'quotesState',
  default: state.quotes
})

const codeState = atom({
  key: 'codeState',
  default: state.code
})

const guessState = atom({
  key: 'guessState',
  default: state.guesses
})

function isLetter(char) {
  return char.match(/[a-z]/i)
}

const encodedQuoteState = selector({
  key: 'encodedQuoteState',
  get: ({get}) => {
    const quotes = get(quotesState)
    const encodedQuotes = []
    const code = get(codeState)
    for(const quote of quotes) {
      encodedQuotes.push({
        author: quote.author,
        quote: quote.quote.split('').map(char => {
          if (isLetter(char)) return code[char.toUpperCase()]
          return char
        }).join('')
      })
    }
    return encodedQuotes
  }
})

const winningState = selector({
  key: 'decodedQuoteState',
  get: ({get}) => {
    const quotes = get(quotesState)
    const encodedQuotes = get(encodedQuoteState)
    const guesses = get(guessState)
    for(const [index, quote] of quotes.entries()) {
      const decodedQuote = encodedQuotes[index].quote.split('').map(char => {
        if(isLetter(char)) return guesses[char.toUpperCase()]
        return char
      }).join('')
      console.log(decodedQuote, quote.quote)
      if (decodedQuote !== quote.quote.toUpperCase()) return false
    }
    return true
  }
})

function App() {
  const won = useRecoilValue(winningState)
  return (
    <div className='container'>
      <div className='my-3 text-center'>
        <h1 className='display-5'>Code Breaker</h1>
      </div>
      <div className={'row' + (won ? ' won' : '')}>
        <div class="col-8">
          <CodeContainer />
        </div>
        <div className="col">
          <CodeInput />
        </div>
      </div>
    </div>
  );
}

function CodeContainer() {
  const quotes = useRecoilValue(encodedQuoteState)
  return quotes.map(quote => {
    return <Code quote={quote.quote} author={quote.author} />
  })
}

function Code(props) {
  const guesses = useRecoilValue(guessState)
  const words = props.quote.split(' ')
  const quotesDisplay = words.map(word => {
    const wordDisplay = Array.from(word).map(letter => {
      return <Letter guess={guesses[letter]} letter={letter} />
    })
    return <div className='word'>{wordDisplay}</div>
  })
  return (
    <div>
      <div className='code'>
      {quotesDisplay}
      <div className='author'>{props.author}</div>
      </div>
    </div>
  )
}

function Letter(props) {
  let guess;
  if(isLetter(props.letter)) {
    guess = props.guess ? props.guess : '_'
  } else {
    guess = props.letter
  }
  return (
    <div className='letter-container'>
      <div>{guess}</div>
      <div className={props.guess ? 'strike' : ''}>{props.letter}</div>
    </div>
  )
}

function CodeInput() {
  const [guesses, setGuesses] = useRecoilState(guessState)
  const won = useRecoilValue(winningState)
  const onChange = (event) => {
    const letter = event.target.getAttribute("data-letter")
    setGuesses({
      ...guesses,
      [letter]: event.target.value.toUpperCase()
    })
  }
  const inputs = Object.entries(guesses).map(([letter, to]) => {
    return (
      <li className="guess" key={letter}>
        <label className='form-label'>{letter}</label>
        <input type="text" className='form-control' data-letter={letter} value={to} onChange={onChange} />
      </li>
    )
  })
  return (
    <div className='code-input'>
      { won ? <p className='congrats'>Congrats, you got it!</p> : '' }
      <p>Fill in the letters to solve the scrambled quotes.</p>
      <ul>
        {inputs}
      </ul>
    </div>
  )
}

export default App;
