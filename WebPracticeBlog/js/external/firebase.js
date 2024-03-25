firebase.initializeApp({
  apiKey: "AIzaSyBdWYsG_7Iue367A9xbHSsIfFKTbW-bB1A",
  authDomain: "webdesignblog-a4a18.firebaseapp.com",
  databaseURL: "https://webdesignblog-a4a18.firebaseio.com",
  projectId: "webdesignblog-a4a18",
  storageBucket: "webdesignblog-a4a18.appspot.com",
  messagingSenderId: "1097663391354"
});

firebase.auth().useDeviceLanguage();

class FirebaseManager {
  deleteUser(user) {
    
  }
  
  updateUsername(user, first, last, callback) {
    firebase.database().ref(`users/${user.uid}`).update({
      name: first + ' ' + last
    })
    .then(callback);
  }
  
  updateProfilePhoto(user, photo, callback) {
    return firebase.database().ref(`users/${user.uid}`).update({
      photo
    });
  }
  
  reauthenticateUser(user, password)  {
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, password);
    
    return user.reauthenticateWithCredential(credentials);
  }
  
  getUserByUID(uid) {
    return firebase.database()
      .ref(`users/${uid}`)
      .once('value')
      .then(snap => snap.val());
  }
  
  signInUser(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }
  
  createUser(email, password, first, last, complete, error) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(user => {
        firebase.database().ref(`users/${user.uid}`).set({
          name: first + ' ' + last,
          photo: 'data:image/png;base64,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'
        })
        .then(complete);
      })
      .catch(error);
  }
}

export const {
  deleteUser,
  updateUsername,
  updateProfilePhoto,
  reauthenticateUser,
  getUserByUID,
  signInUser,
  createUser
} = new FirebaseManager();
