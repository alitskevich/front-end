/**
 * Underlying internals:
 */
const $$STRING = (s) => s
const $$STRUCT = (def) => e => e
const $$STRUCT_ASSIGN = (s, delta) => Object.assign(s, delta)
const $$HASH = (e) => e || {}
const $$HASH_KEYS = (e) => Object.keys(e)
const $$HASH_HAS_KEY = (e, key) => (key in e)
const $$HASH_GET = (e, key) => e[key]
const $$HASH_PUT = (e, key, val) => {e[key]=val}
const $$ARRAY = () => []
const $$ARRAY_INDEX_OF = (a, e) => a.indexOf(e)
const $$ARRAY_CONCAT = (a, a1) => a.concat(a1)

const __STACK = []
const $$STACK_PUSH = e => STACK.unshift(e)
const $$STACK_POP = () => STACK.shift()
const $$STACK_CURRENT = () => STACK[0]