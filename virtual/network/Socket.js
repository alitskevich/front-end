
/**
 *
   Socket socket = getSocket(type = "TCP")
  connect(socket, address = "1.2.3.4", port = "80")
  send(socket, "Hello, world!")
  close(socket)
*/
export class Socket {

  static getSocket(type, port){

    return new Socket(type, port);
  }

  constructor(type, port){
    this.type = type;
    this.port = port;
  }

  connect(endpoint = { ip:'0.0.0.0', port:0 }) {

    this.endpoint = endpoint;
  }

  send(bytes) {

  }

  onMessage(bytes){


  }

  close() {

  }
}
