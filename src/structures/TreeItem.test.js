import { default as Item } from './TreeItem.js';
import assert from 'assert';

describe('TreeItem.props', function () {

    it('parent', ()=> {

        var top = new Item({ text: '0' });
        var item1 = new Item({ text: '1' });
        var item2 = new Item({ text: '2' });

        item1.parent = top;
        item2.parent = top;

        assert.equal(top.first, item1, 'first');
        assert.equal(top.last, item2, 'last');
        assert.equal(item1.next, item2, 'next');
        assert.equal(item2.prev, item1, 'prev');
    });

    it('next', ()=> {

        var top = new Item({ text: '0' });
        var item1 = new Item({ text: '1' });
        var item2 = new Item({ text: '2' });

        item1.parent = top;
        item1.next = item2;

        assert.equal(top.first, item1, 'first');
        assert.equal(top.last, item2, 'last');
        assert.equal(item1.next, item2, 'next');
        assert.equal(item2.prev, item1, 'prev');
    });

    it('prev', ()=> {

        var top = new Item({ text: '0' });
        var item1 = new Item({ text: '1' });
        var item2 = new Item({ text: '2' });

        item2.parent = top;
        item2.prev = item1;

        assert.equal(top.first, item1, 'first');
        assert.equal(top.last, item2, 'last');
        assert.equal(item1.next, item2, 'next');
        assert.equal(item2.prev, item1, 'prev');
    });

});
