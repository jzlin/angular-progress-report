import { Component } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

interface Post {
  id?: string;
  title: string;
  author: string;
  authorUid: string;
  comments: Comment[];
  createOn: Date;
  lastUpdateOn: Date;
}

interface Comment {
  id?: string;
  author: string;
  authorUid: string;
  text: string;
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

  private postsRef: AngularFireList<Post>;

  constructor(
    private db: AngularFireDatabase,
    public afAuth: AngularFireAuth
  ) {
    this.postsRef = this.db.list<Post>('posts');
    this.posts = this.postsRef.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          // console.log(a);
          const data = a.payload.val();
          const id = a.key;
          return { id, ...data } as Post;
        });
      });
  }

  addPost() {
    const now = new Date();
    const item: Post = {
      author: this.afAuth.auth.currentUser && this.afAuth.auth.currentUser.displayName,
      authorUid: this.afAuth.auth.currentUser && this.afAuth.auth.currentUser.uid,
      title: this.postTitleInput,
      comments: [],
      createOn: now,
      lastUpdateOn: now
    };
    this.postsRef.push(item);
    this.postTitleInput = '';
  }

  removePost(post: Post) {
    this.postsRef.remove(post.id);
  }

  addComment(post: Post, commentInput) {
    const now = new Date();
    if (!post.comments) {
      post.comments = [];
    }
    post.comments.push({
      author: this.afAuth.auth.currentUser && this.afAuth.auth.currentUser.displayName,
      authorUid: this.afAuth.auth.currentUser && this.afAuth.auth.currentUser.uid,
      text: commentInput.value,
      createOn: now,
      lastUpdateOn: now
    });
    this.postsRef.update(post.id, post);
    commentInput.value = '';
  }

  removeComment(post: Post, comment) {
    post.comments = post.comments.filter(c => c !== comment);
    this.postsRef.update(post.id, post);
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
