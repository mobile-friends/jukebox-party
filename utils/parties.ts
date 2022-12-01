import firebase from 'firebase';

export function doesPartyExist(
  document: firebase.database.Reference
): Promise<boolean> {
  return document.get().then((snapshot) => snapshot.exists());
}
