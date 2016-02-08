class Promise {

    constructor(fn) {


        // stub function can be used immediately
        this._then = (result)=>(this.result = result);

        // stub function can be used immediately
        this._catch = (error)=>(this.error = error);

        fn(
            (result)=> this._then(result)
            ,
            (error)=>this._catch(error)
        );
    }

    then(thenFn, catchFn) {

        if (catchFn){
            this.catch(catchFn);
        }

        // wrap with try/catch
        this._then =  (result)=> {

            try {

                thenFn(result);

            } catch (ex) {

                this._catch(ex);
            }
        };

        // invoke immediately if result is already exists.
        if (this.result) {

            this._then(result);

        }
    }

    catch(catchFn) {

        this._catch = catchFn;

        // invoke immediately if error is already exists.
        if (this.error) {

            this._catch(error);

        }
    }
}