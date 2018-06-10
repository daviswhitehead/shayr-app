const setPersonData = (personData) => {
  return {
    type: "setPersonData",
    value: personData
  };
};

const watchPersonData = () => {
  return function(dispatch) {
    firebase.database().ref("person").on("value", function(snapshot) {

        var personData = snapshot.val();
        var actionSetPersonData = setPersonData(personData);
        dispatch(actionSetPersonData);

    }, function(error) { console.log(error); });
  }
};
