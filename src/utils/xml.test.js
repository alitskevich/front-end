/**
 * Created by Aliaksandr_Litskevic on 9/7/2015.
 */
import assert from 'assert';
import { xmlParse } from './xml.js';

const TEXT = `
<div class="CodeMirror-cursors">
    <!-- comment -->
    <div class="CodeMirror&quot;cursor" style="left: 4px; top: 108px; height: 18px;">
        abc
        <br/>
        <img src="url"/>
        def
        <p>inside</p>
        &amp; ghi
    </div>
</div>
`;

describe('Xml', function () {

  it('parse', ()=> {

    var top = xmlParse(TEXT);

    // console.log(`top ${top}`);

    assert.equal(top.children[0].children[2].attributes.src, `url`);

    assert.equal(top.children[0].attributes.class, `CodeMirror"cursor`);
  });
});
