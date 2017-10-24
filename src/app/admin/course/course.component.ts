import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Course } from '../../interfaces/course';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  courses: BehaviorSubject<Course[]>;

  private coursesCollection: AngularFirestoreCollection<Course>;

  constructor(
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.initCoursesCollection();
  }

  removeCourse(course: Course) {
    this.coursesCollection.doc(course.id).delete()
      .catch(error => {
        console.error(`${error.name}: ${error.code}`);
      });
  }

  private initCoursesCollection() {
    this.coursesCollection = this.afs.collection<Course>('courses', ref => ref.orderBy('startOn'));
    this.courses = new BehaviorSubject([]);
    this.coursesCollection.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data } as Course;
        });
      })
      .subscribe(this.courses);
  }

}
