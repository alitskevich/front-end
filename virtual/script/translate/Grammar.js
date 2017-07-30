export const GRAMMAR = `
Literal:
  IntegerLiteral
  FloatingPointLiteral
  StringLiteral
  false
  true
  null
  undefined

PrimaryExpression:
  ( Expression )
  Identifier
  Literal
  this

MemberExpression:
  PrimaryExpression
  PrimaryExpression . MemberExpression
  PrimaryExpression [ Expression ]
  PrimaryExpression ( ArgumentList ? )

Constructor:
  this . ConstructorCall
  ConstructorCall

ConstructorCall:
  Identifier
  Identifier ( ArgumentList ? )
  Identifier[ . ]

UnaryExpression:
  MemberExpression
  UnaryOperator UnaryExpression
  minus UnaryExpression
  IncrementOperator MemberExpression
  MemberExpression IncrementOperator
  new Constructor
  delete MemberExpression

OrExpression:
  AndExpression [ _||_ ]
AndExpression:
  EqualityExpression [ _&&_ ]
EqualityExpression:
  RelationalExpression [ _==_ | _===_]
RelationalExpression:
  AdditiveExpression [ _>_ | _<_ ]
AdditiveExpression:
  MultiplicativeExpression[ plus minus ]
MultiplicativeExpression:
  UnaryExpression[ asterisk ]


AssignmentExpression:
  ConditionalExpression[ equal ]

ArgumentList:
  AssignmentExpression [ , ]

ConditionalExpression:
  OrExpression
  OrExpression ? AssignmentExpression : AssignmentExpression

Expression:
  AssignmentExpression[ , ]

Variables:
  let Variable[ , ]
  const Variable[ , ]

Variable:
  Identifier
  Identifier equal AssignmentExpression

Condition:
  ( Expression )

Statement:
  if Condition Statement
  if Condition Statement else Statement
  while Condition Statement
  for ( Variables? ; Expression? ; Expression? ) Statement
  for ( let Variable in Expression ) Statement
  for ( let Variable of Expression ) Statement
  return Expression?
  CompoundStatement
  Variables
  Expression

CompoundStatement:
  { Statement[;] }

Class:
  class Identifier { ClassElement[] }

Function:
  function Identifier? ( Parameter[,]? ) CompoundStatement
  ( Parameter[,]? ) => CompoundStatement | Expression

Element:
  Function
  Statement[;]

Program:
  Element[]
`;
