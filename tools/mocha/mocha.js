
export default function (testSuite, options={}) {
    let caseDescription = ''
    let itDescription = ''
    let count = 0
    let errors = []

    function assert (b, error, w) {
      if (!b) {
        console.warn(b, 'context:', w)
        throw new Error(error)
      }
    }

    assert.equal = function (a, b, error, w) {
        if (a !== b) {
          console.warn(a, '===', b, 'context:', w)
          throw new Error(error)
        }
    }  

    function describe (s, fn) {
        caseDescription = s
        run(fn)
    }
  
    function it(s, fn) {
        itDescription = s
        run(fn)
    }

    function run (fn) {
        try {
            fn.call(t)
        } catch (e) {
            err = new Error([testSuite.name, caseDescription, itDescription, e.message].join(': '))
            console.error(err)
            error.push(err)
        }
        count++
    }
  
    testSuite({assert, it, describe})

    if(options.callback) {
        options.callback( errors.length ? { errors } : null)
    } else {
        if (errors.length) {
            console.error('[' + testSuite.name + '] Tests failed: ' + errors.length + ' of ' + count)
        } else {
            console.log('[' + testSuite.name + '] Tests passed successfully: ' + count)
        }
    }
  }
  