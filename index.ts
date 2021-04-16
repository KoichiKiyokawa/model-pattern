import { pick } from 'rambda'

const a = { a: 1, b: 2 }
const allowedCols = ['a'] as const
const res = pick(allowedCols, a)
console.log(res)
