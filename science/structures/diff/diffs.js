// Implementation of the 'O(ND) Diff Algorithm'
// @see http://www.xmailserver.org/diff2.pdf
// @see https://github.com/igstan/igstan.ro/blob/master/_drafts/2015-01-01-paper-an-o-nd-difference-algorithm.md
// @see http://rosettacode.org/wiki/Longest_common_subsequence#Dynamic_programming.2C_walker_class
// @see http://simplygenius.net/Article/DiffTutorial1

export function getVs(sequence1, sequence2) {

  const N = sequence1.length;
  const M = sequence2.length;

  const MAX = Math.max(0, M + N);

  const Vs = [];

  let x = 0;
  let y = 0;

  for (let D = 0; D <= MAX; D++) {

    const V = Vs[D] = Object.assign({}, Vs.slice(-1)[0] || { 1: 0 });

    for (let k = -D; k <= D; k += 2) {

      if (k === -D || (k !== D && V[ k - 1 ] < V[ k + 1 ])) {

        x = V[ k + 1 ];
      } else {

        x = V[ k - 1 ] + 1;
      }

      y = x - k;

      while (x < N && y < M && sequence1[x] === sequence2[y]) {

        x = x + 1;
        y = y + 1;
      }

      V[k] = x;

      if (x >= N && y >= M) {

        return Vs;
      }
    }
  }
}

export function getSes(Vs, sequence1, sequence2) {

  let x = sequence1.length;
  let y = sequence2.length;

  const ses = [];

  for (let D = Vs.length - 1; x > 0 || y > 0; D--) {

    const V = Vs[D];
    const k = x - y;

    const xEnd = V[k];
    const yEnd = x - k;

    const isVertical = k === -D || (k !== D && V[ k - 1 ] < V[ k + 1 ]);

    const kPrev = isVertical ? k + 1 : k - 1;

    const xStart = V[kPrev];
    const yStart = xStart - kPrev;

    const xMid = isVertical ? xStart : xStart + 1;
    const yMid = xMid - k;

    // Check if it is a snake
    if (xEnd !== xMid && yEnd !== yMid) {

      for (let i = xEnd - 1; i >= xMid; i--) {

        ses.push({
          line: sequence1[i]
        });
      }
    }

    // Check if SES starts with a snake
    if (yMid !== 0 || xMid !== 0) {

      ses.push({
        operation: isVertical ? 'insertion' : 'deletion',
        line: isVertical ? sequence2[yMid - 1] : sequence1[xMid - 1]
      });
    }

    x = xStart;
    y = yStart;
  }

  return ses.reverse();
}

export function calculateDiffs(sequence1, sequence2) {

  const Vs = getVs(sequence1, sequence2);
  return getSes(Vs, sequence1, sequence2);
}
