export default `
; Writes Hello World to the output

hello: DB "Hello World!"    ; Variable

start:
	MOV C, hello    ; Point to var 
	MOV D, 232	    ; Point to output
	CALL print
    HLT             ; Stop execution

print:			    ; print(C:*from, D:*to)
	PUSH A
	PUSH B
	MOV B, 0

.loop:
	MOV A, [C]	    ; Get char from var
	MOV [D], A	    ; Write to output
	INC C
	INC D  
	CMP B, [C]	    ; Check if end
	JNZ .loop	    ; jump if not

	POP B
	POP A
	RET 
`