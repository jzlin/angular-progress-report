import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from "angularfire2/firestore";
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from "firebase/app";

interface Post {
  id?: string;
  title: string;
  comments: string[];
  createOn: Date;
  lastUpdateOn: Date;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'app';

  postTitleInput = '';
  posts: Observable<Post[]>;
  private postCollection: AngularFirestoreCollection<Post>;

  constructor(
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    this.postCollection = afs.collection<Post>('posts', ref => ref.orderBy('createOn'));
    this.posts = this.postCollection.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data } as Post;
        });
      });
  }

  addPost() {
    const now = new Date();
    const item: Post = {
      title: this.postTitleInput,
      comments: [],
      createOn: now,
      lastUpdateOn: now
    };
    this.postCollection.add(item);
    this.postTitleInput = '';
  }

  removePost(post: Post) {
    this.postCollection.doc(post.id).delete();
  }

  addComment(post: Post, commentInput) {
    post.comments.push(commentInput.value);
    post.lastUpdateOn = new Date();
    this.postCollection.doc(post.id).update(post);
    commentInput.value = '';
  }

  removeComment(post: Post, comment) {
    post.comments = post.comments.filter(c => c !== comment);
    post.lastUpdateOn = new Date();
    this.postCollection.doc(post.id).update(post);
  }

  trackById(data) {
    return data.id;
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}
