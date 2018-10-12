const config = require("./Config");
const URL = require("url");
const ts = config.admin.firestore.FieldValue.serverTimestamp();

exports.addCreatedAt = payload => {
  return {
    ...payload,
    createdAt: ts
  };
};

exports.addUpdatedAt = payload => {
  return {
    ...payload,
    updatedAt: ts
  };
};

exports.addDeletedAt = payload => {
  return {
    ...payload,
    deletedAt: ts
  };
};

exports.getReferenceId = (reference, position) => {
  return reference.split("/")[position];
};

exports.getDocument = (db, ref) => {
  return db
    .doc(ref)
    .get()
    .then(queryDocumentSnapshot => {
      return {
        id: queryDocumentSnapshot.id,
        ref: ref,
        ...queryDocumentSnapshot.data()
      };
    });
};

exports.getDocumentsInCollection = (db, ref) => {
  const obj = {};
  return db
    .collection(ref)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        obj[doc.id] = {
          ref: ref + `/${doc.id}`,
          ...doc.data()
        };
      });
      return obj;
    });
};

exports.returnBatch = batch => {
  return batch
    .commit()
    .then(value => {
      console.log("success");
      return value;
    })
    .catch(e => {
      console.log("failure");
      console.error(e);
      return e;
    });
};
