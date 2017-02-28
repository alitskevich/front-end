import * as objectsMethods from './diffs.js';
import { test } from './test.js';

const TEST_DATA = {
  getVs: [
    {
      id: 'should return undefined',
      args: [ 1, 2 ],
      expected: Object.undefined
    },
    {
      id: 'should be not modified',
      args: [ [], [] ],
      expected: [ { 0: 0, 1: 0 } ]
    },
    {
      id: 'first string is "a" and second string is "a" should be not modified',
      args: [ ['a'], ['a'] ],
      expected: [ { 0: 1, 1: 0 } ]
    },
    {
      id: 'first string is "a" and second string is "b" should be modified',
      args: [ ['a'], ['b']],
      expected: [ { 0: 0, 1: 0 }, { 0: 0, 1: 1, '-1': 0 }, { 0: 1, 1: 1, '-1': 0, '-2': 0 } ]
    },
    {
      id: 'first string is "abc" and second string is "adc" should be modified',
      args: [ ['a', 'b', 'c'], ['a', 'd', 'c']],
      expected: [ { 0: 1, 1: 0 }, { 0: 1, 1: 2, '-1': 1 }, { 0: 3, 1: 2, '-1': 1, '-2': 1 } ]
    },
    {
      id: 'first string is "abc" and second string is "ac" should be modified',
      args: [ ['a', 'b', 'c'], ['a', 'c']],
      expected: [ { 0: 1, 1: 0 }, { 0: 1, 1: 3, '-1': 1 } ]
    },
    {
      id: 'first string is "ab" and second string is "ba" should be modified',
      args: [ ['a', 'b'], ['b', 'a'] ],
      expected: [ { 0: 0, 1: 0 }, { 0: 0, 1: 2, '-1': 1 }, { 0: 2, 1: 2, '-1': 1, '-2': 1 } ]
    },
    {
      id: 'first string is "abcd" and second string is "abef" should be modified',
      args: [['a', 'b', 'c', 'd'], ['a', 'b', 'e', 'f']],
      expected: [
        { 0: 2, 1: 0 },
        { 0: 2, 1: 3, '-1': 2 },
        { 0: 3, 1: 3, 2: 4, '-1': 2, '-2': 2 },
        { 0: 3, 1: 4, 2: 4, 3: 5, '-1': 3, '-2': 2, '-3': 2 },
        { 0: 4, 1: 4, 2: 4, 3: 5, '-1': 3, '-2': 3, '-3': 2, '-4': 2 }
      ]
    },
    {
      args: [ [1, 2], [1, 2] ],
      expected: [ { 0: 2, 1: 0 } ]
    }
  ],
  getSes: [
    {
      id: 'should return empty array, because arguments is empty',
      args: [ [], [], [] ],
      expected: []
    },
    {
      id: 'should return line "a"',
      args: [ [{ 0: 1, 1: 0 }], ['a'], ['a'] ],
      expected: [ { line: 'a' } ]
    },
    {
      id: 'first string is "a" and second string is "b" should delete "a" and insert "b"',
      args: [
        [
          { 0: 0, 1: 0 },
          { 0: 0, 1: 1, '-1': 0 },
          { 0: 1, 1: 1, '-1': 0, '-2': 0 }
        ],
        ['a'],
        ['b']
      ],
      expected: [
        { operation: 'deletion', line: 'a' },
        { operation: 'insertion', line: 'b' }
      ]
    },
    {
      id: 'first string string is "abc" and second string is "adc" should delete "b" and insert "d"',
      args: [
        [
          { 0: 1, 1: 0 },
          { 0: 1, 1: 2, '-1': 1 },
          { 0: 3, 1: 2, '-1': 1, '-2': 1 }
        ],
        ['a', 'b', 'c'],
        ['a', 'd', 'c']],
      expected: [
        { line: 'a' },
        { operation: 'deletion', line: 'b' },
        { operation: 'insertion', line: 'd' },
        { line: 'c' }
      ]
    },
    {
      id: 'first string is "abc" and second string is "ac" should delete "b"',
      args: [ [ { 0: 1, 1: 0 }, { 0: 1, 1: 3, '-1': 1 } ], ['a', 'b', 'c'], ['a', 'c'] ],
      expected: [ { line: 'a' }, { operation: 'deletion', line: 'b' }, { line: 'c' } ]
    },
    {
      id: 'first string is "abcd" and second string is "abef" should delete "cd" and insert "ef"',
      args: [
        [
          { 0: 2, 1: 0 },
          { 0: 2, 1: 3, '-1': 2 },
          { 0: 3, 1: 3, 2: 4, '-1': 2, '-2': 2 },
          { 0: 3, 1: 4, 2: 4, 3: 5, '-1': 3, '-2': 2, '-3': 2 },
          { 0: 4, 1: 4, 2: 4, 3: 5, '-1': 3, '-2': 3, '-3': 2, '-4': 2 }
        ],
        ['a', 'b', 'c', 'd'],
        ['a', 'b', 'e', 'f']
      ],
      expected: [
        { line: 'a' },
        { line: 'b' },
        { operation: 'deletion', line: 'c' },
        { operation: 'deletion', line: 'd' },
        { operation: 'insertion', line: 'e' },
        { operation: 'insertion', line: 'f' }
      ]
    },
    {
      id: 'first string is "ab" and second string is "ba" should delete "a" in a start and insert in the end',
      args: [
        [
          { 0: 0, 1: 0 },
          { 0: 0, 1: 2, '-1': 1 },
          { 0: 2, 1: 2, '-1': 1, '-2': 1 }
        ],
        ['a', 'b'],
        ['b', 'a']
      ],
      expected: [
        { operation: 'deletion', line: 'a' },
        { line: 'b' },
        { operation: 'insertion', line: 'a' }
      ]
    },
    {
      id: 'first string is "12" and second string the same should return not modified string.',
      args: [ [ { 0: 2, 1: 0 } ], [1, 2], [1, 2] ],
      expected: [ { line: 1 }, { line: 2 } ]
    }
  ]
};

describe('Diffs', () => {
  test(objectsMethods, TEST_DATA);
});
