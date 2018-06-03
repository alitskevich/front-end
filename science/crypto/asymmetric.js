/**
 * In contrast to symmetric encryption, public key cryptography (asymmetric encryption) 
 * uses pairs of keys (one public, one private) instead of a single shared secret - 
 * public keys are for encrypting data, and private keys are for decrypting data.

A public key is like an open box with an unbreakable lock. If someone wants to send you a message, 
they can place that message in your public box, and close the lid to lock it. 
The message can now be sent, to be delivered by an untrusted party without needing 
to worry about the contents being exposed. Once I receive the box, 
I'll unlock it with my private key - the only existing key which can open that box.

Exchanging public keys is like exchanging those boxes - 
each private key is kept safe with the original owner, 
so the contents of the box are safe in transit.
 */

  /** Generate and store keypair */
  function generateKeypair () {
    crypt = new JSEncrypt({default_key_size: 2056})
    privateKey = crypt.getPrivateKey()
  
    // Only return the public key, keep the private key hidden
    return crypt.getPublicKey()
  }
  
  /** Encrypt the provided string with the destination public key */
  function encrypt (content, publicKey) {
    crypt.setKey(publicKey)
    return crypt.encrypt(content)
  }
  
  /** Decrypt the provided string with the local private key */
  function decrypt (content) {
    crypt.setKey(privateKey)
    return crypt.decrypt(content)
  }