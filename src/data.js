import quotes from './quotes.json'

const randomQuotes = []
for (let i = 0; i < 3; i++) {
  randomQuotes.push(
    quotes.quotes.splice(Math.random() * quotes.quotes.length, 1)[0]
  )
}

const state = {
  quotes: randomQuotes,
  code: {},
  guesses: {},
}

const alpha = Array.from(Array(26))
  .map((_, i) => i + 65)
  .map((i) => String.fromCharCode(i))
const codes = [...alpha]

for (const char of alpha) {
  state['guesses'][char] = ''
  state['code'][char] = codes.splice(Math.random() * codes.length, 1)[0]
}

export default state
