class Promise{

    constructor(fn){


        this.resolve=(result)=>{

            if (this._then){

                this._then(result)

            } else {

                this.result=result;
            }

        };

        this.reject=(error)=>{

            if (this._catch){

                this._catch(error)

            } else {

                this.error = error;
            }
        };

        fn(this.resolve, this.reject);
    }

    then(h){

        if (this.result){

            h(result)

        } else {

            this._then = h
        }
    }

    catch(h){

        if (this.error){

            h(error)

        } else {

            this._catch = h
        }
    }

}