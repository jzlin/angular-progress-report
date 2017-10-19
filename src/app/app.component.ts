import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';
import * as firebase from 'firebase/app';

interface Post {
  id?: string;
  title: string;
  author: string;
  authorUid: string;
  createOn: Date;
  lastUpdateOn: Date;
}

interface Comment {
  id?: string;
  postId: string;
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
  commentsMap = new Map<string, BehaviorSubject<Comment[]>>();
  private postCollection: AngularFirestoreCollection<Post>;
  private commentCollectionMap = new Map<string, AngularFirestoreCollection<Comment>>();

  constructor(
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    this.initPostCollection();
  }

  private initPostCollection() {
    this.postCollection = this.afs.collection<Post>('posts', ref => ref.orderBy('createOn'));
    this.posts = this.postCollection.snapshotChanges()
      .map(actions => {
        // console.log(`%c post change`, 'color:red;font-size:20px;');
        this.initCommentCollectionMap(actions.map(a => a.payload.doc.id));

        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data } as Post;
        });
      });
  }

  private initCommentCollectionMap(postIds: string[]) {
    Object.keys(this.commentCollectionMap)
      .forEach(key => {
        if (!postIds.includes(key)) {
          this.commentCollectionMap.delete(key);
        }
      });

    postIds.forEach(postId => {
      if (!this.commentCollectionMap.has(postId)) {
        this.initCommentCollection(postId);
      }
    });
  }

  private initCommentCollection(postId: string) {
    const commentCollection = this.afs.collection<Comment>('comments', ref => ref.where('postId', '==', postId).orderBy('createOn'));
    this.commentCollectionMap.set(postId, commentCollection);
    const comments = new BehaviorSubject([]);
    commentCollection.snapshotChanges()
      .map(actions => {
        // console.log(`%c comment change`, 'color:blue;font-size:20px;');
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data } as Comment;
        });
      })
      .subscribe(comments);
    this.commentsMap.set(postId, comments);
  }

  addPost() {
    const now = new Date();
    const newPost: Post = {
      title: this.postTitleInput,
      author: this.afAuth.auth.currentUser && this.afAuth.auth.currentUser.displayName,
      authorUid: this.afAuth.auth.currentUser && this.afAuth.auth.currentUser.uid,
      createOn: now,
      lastUpdateOn: now
    };
    this.postCollection.add(newPost)
      .catch(this.catchHandle);
    this.postTitleInput = '';
  }

  removePost(post: Post) {
    this.commentsMap.get(post.id)
      .take(1)
      .subscribe(comments => {
        comments.forEach(comment => {
          this.commentCollectionMap.get(post.id).doc(comment.id).delete()
            .catch(this.catchHandle);
        });
      });
    this.postCollection.doc(post.id).delete()
      .catch(this.catchHandle);
  }

  addComment(post: Post, commentInput) {
    const now = new Date();
    const newComment: Comment = {
      postId: post.id,
      author: this.afAuth.auth.currentUser && this.afAuth.auth.currentUser.displayName,
      authorUid: this.afAuth.auth.currentUser && this.afAuth.auth.currentUser.uid,
      text: commentInput.value,
      createOn: now,
      lastUpdateOn: now
    };

    this.commentCollectionMap.get(post.id).add(newComment)
      .catch(this.catchHandle);

    this.postCollection.doc(post.id).update({ lastUpdateOn: now })
      .catch(this.catchHandle);
    commentInput.value = '';
  }

  removeComment(post: Post, comment: Comment) {
    this.commentCollectionMap.get(post.id).doc(comment.id).delete()
      .catch(this.catchHandle);

    this.postCollection.doc(post.id).update({ lastUpdateOn: new Date() })
      .catch(this.catchHandle);
  }

  trackById(data) {
    return data.id;
  }

  private catchHandle(error) {
    if (error && error.name === 'FirebaseError') {
      console.error(error.code);
    }
    else {
      console.error(error);
    }
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}
