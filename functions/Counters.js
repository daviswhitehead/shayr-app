exports.updateCounter = (change, context, db, counterType) => {

   // active false means the user removed their action
   var activeToggle = change.after.data().active;

   // get the action post reference
   var postRef = db.doc(change.after.data().post);

   return db.runTransaction(transaction => {
     // get the post data
     return transaction.get(postRef).then((doc) => {
       var data = doc.data()

       // get counter value or initialize
       var count = data[counterType] ? data[counterType] : 0

       // increment counter
       if (activeToggle) {
         count = count + 1
       } else {
         count = count - 1
       }

       // update counter
       var payload = {};
       payload[counterType] = count;

       return transaction.update(
         postRef,
         payload,
         {merge: true}
       );
     });
   });
};
