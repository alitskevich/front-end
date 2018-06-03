export function testSuite1({describe, it, assert}) {

  describe('describe test case', ()=> {

    it('describe test', ()=>{
      assert(1, 'number 1 should be asserted')
    })

    it('describe test 2', ()=>{
      assert.equls(1, 2, 'number 1 should equals to 2')
    })
  })
}
