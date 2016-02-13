# Common background

## Data and Information

* `alphabet`
> finite collection of signs(letters).

* `data`
> finite sequence of letters of the same alphabet.

* `token`
> one of elementary piece that data can be splitted into (i.e. by some special stop-signswhite-space). 

* `metadata`
> description on given data (about how to recognize and handle it). 

* `information`
> data equipped with its metadata.

## Formal Language

* `rule`
> assigment, that allows to substitute given token(non-terminal) with sequence on termins or non-terminals

* `formal grammar`
> union of 1) alphabet, 2) set of terminal tokens(termins) 3) set of non-terminals, 4) set of rules on them and 5) starting non-terminal.

* `expression`
> specific way of applying rules from beginning

* `text`
> terminated expression (without non-terminals).

* `formal language`
> set of all texts can be produced in given grammar.

* `parsing`
 process of re-constructing of the most preceding non-terminal expression from given text.

## Code, Data and Programs

*`domain`
> specific subset from given language with relations defined on it

*`relation`
a way to refer some result value based on input arguments

* `value`
> elementary piece of data - one from defined domain

* `reference`
> a way to address to a value from code

*`variable`
> reference by name in some structure

*`structure`
container of references to sub-structures or primitives.
TBD



* `code`
> text of some formal language, that can be used as instruction for some proccessor.

* `processor`
> some circuit, that able to transform data (from input to output) under control of some code.
