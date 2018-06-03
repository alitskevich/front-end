/**
 * Let's say we're trading numbers. 
 * We're sending the numbers through a third party, 
 * but we don't want the third party to know which number we are exchanging.
 * 
 * @param {*} secret In order to accomplish this, we'll exchange a shared secret first
 */
const symmetric = (secret)=>{
    return {
        encode(x){
            return x * secretKey + 2
        },
        // Modulo is thus considered a "one-way" function since it cannot be trivially reversed.
        decode (y) {
            return y / secretKey
        }
    }
}