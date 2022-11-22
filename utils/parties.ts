import firebase from 'firebase';

const doesPartyExist = async (
  databaseRef: firebase.database.Reference
): Promise<boolean> => {
  let doesItExist;
  await databaseRef
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        doesItExist = true;
      } else {
        doesItExist = false;
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return doesItExist;
};

export default doesPartyExist;
