import './components.css'

import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil'
import { encodedQuoteState, guessState, winningState } from './state'
import { isLetter } from './utils'

function App() {
  return (
    <RecoilRoot>
      <Container />
    </RecoilRoot>
  )
}

function Container() {
  const won = useRecoilValue(winningState)
  return (
    <div className='container'>
      <h1 className='title my-3 text-center'>Code Breaker</h1>
      <div className={'row' + (won ? ' won' : '')}>
        <div className='col-8'>
          <CodeContainer />
        </div>
        <div className='col'>
          <CodeInput />
        </div>
      </div>
    </div>
  )
}

function CodeContainer() {
  const quotes = useRecoilValue(encodedQuoteState)
  return quotes.map((quote, i) => {
    return <Code key={`quote-${i}`} quote={quote.quote} author={quote.author} />
  })
}

function Code(props) {
  const guesses = useRecoilValue(guessState)
  const words = props.quote.split(' ')
  const quotesDisplay = words.map((word, i) => {
    const wordDisplay = Array.from(word).map((letter, j) => {
      return (
        <Letter key={`letter-${j}`} guess={guesses[letter]} letter={letter} />
      )
    })
    return (
      <div key={`word-${i}`} className='word'>
        {wordDisplay}
      </div>
    )
  })
  return (
    <div className='code'>
      {quotesDisplay}
      <div className='author'>{props.author}</div>
    </div>
  )
}

function Letter(props) {
  let guess
  if (isLetter(props.letter)) {
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
    event.preventDefault()
    if (event.target.value.length > 1) {
      event.target.value = event.target.value.substr(-1, 1)
    }
    const letter = event.target.getAttribute('data-letter')
    setGuesses({
      ...guesses,
      [letter]: event.target.value.toUpperCase(),
    })
  }
  const inputs = Object.entries(guesses).map(([letter, to]) => {
    return (
      <li className='guess' key={letter}>
        <label className='form-label'>{letter}</label>
        <input
          type='text'
          className='form-control'
          data-letter={letter}
          value={to}
          onChange={onChange}
        />
      </li>
    )
  })
  return (
    <div className='code-input'>
      {won ? <p className='congrats'>Congrats, you got it!</p> : ''}
      <p>Fill in the letters to solve the scrambled quotes.</p>
      <ul>{inputs}</ul>
    </div>
  )
}

export default App
