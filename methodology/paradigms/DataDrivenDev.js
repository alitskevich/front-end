/**
 * Structure of program is determined by structure of data (input data or metadata)
 */
 export const DataDriven = {

   transform(data, meta) {

     for (let item of meta) {

       if (item.default && !data[item.id]) {

         data[item.id] = item.default;
       }
     }

   }

 };
