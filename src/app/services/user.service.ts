import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';

import { User } from '../interfaces/user';

@Injectable()
export class UserService {

  private usersCollection: AngularFirestoreCollection<any>;
  private users: BehaviorSubject<any[]>;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.usersCollection = this.afs.collection('users');
    this.users = new BehaviorSubject([]);
    this.usersCollection.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
      .subscribe(this.users);
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(data => {
        const userData: User = {
          uid: data.user.uid,
          displayName: data.user.displayName,
          email: data.user.email,
          emailVerified: data.user.emailVerified,
          isAnonymous: data.user.isAnonymous,
          phoneNumber: data.user.phoneNumber,
          photoURL: data.user.photoURL,
          providerData: data.user.providerData.map(provider => {
            return {
              providerId: provider.providerId,
              uid: provider.uid,
              displayName: provider.displayName,
              email: provider.email,
              phoneNumber: provider.phoneNumber,
              photoURL: provider.photoURL
            };
          })
        };

        this.users.take(1)
          .subscribe(users => {
            const matchUsers = users.filter(user => user.uid === userData.uid);
            if (matchUsers.length > 0) {
              matchUsers.forEach(user => {
                this.usersCollection.doc(user.id).update(userData);
              });
            }
            else {
              this.usersCollection.add(userData);
            }
          });
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}
