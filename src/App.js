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
      encodedQuotes.push(quote.split('').map(char => {
        if (isLetter(char)) return code[char.toUpperCase()]
        return char
      }))
    }
    return encodedQuotes
  }
})

function App() {
  return (
    <div className="container">
      <div className='px-4 py-5 my-5 text-center'>
        <h1 className='display-5 fw-bold'>Code Breaker</h1>
        <CodeContainer />
        <CodeInput />
      </div>
    </div>
  );
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

function CodeContainer() {
  const quotes = useRecoilValue(encodedQuoteState)
  return quotes.map(quote => {
    return <Code quote={quote} />
  })
}

function Code(props) {
  const guesses = useRecoilValue(guessState)
  const quotesDisplay = []
  const letters = Array.from(props.quote)
  quotesDisplay.push(letters.map(letter => {
    return <Letter guess={guesses[letter]} letter={letter} />
  }))
  return (
    <div className='code col-lg-10 mx-auto'>{quotesDisplay}</div>
  )
}

function CodeInput() {
  const [guesses, setGuesses] = useRecoilState(guessState)
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
    <div className='code col-lg-6 mx-auto'>
      <ul className="code-input">
        {inputs}
      </ul>
    </div>
  )
}

export default App;
