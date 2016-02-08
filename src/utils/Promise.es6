class Promise {

    constructor(fn) {

        this._catch = (error)=>(this.error = error);

        this._then = (result)=>(this.result = result);

        fn(
            (result)=> this._then(result)
            ,
            (error)=>this._catch(error)
        );
    }

    then(resultFn, errorFn) {

        if (errorFn){
            this.catch(errorFn);
        }

        this._then =  (result)=> {

            try {

                resultFn(result);

            } catch (ex) {

                this._catch(ex);
            }
        };

        // invoke immediately if result is already exists.
        if (this.result) {

            this._then(result);

        }
    }

    catch(errorFn) {

        this._catch = errorFn;

        // invoke immediately if error is already exists.
        if (this.error) {

            this._catch(error);

        }
    }
}