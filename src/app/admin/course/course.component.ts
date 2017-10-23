import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
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

  courseAddModel: Course;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.initCourseAddModel();
    this.initCoursesCollection();
  }

  addCourse(courseForm) {
    const now = new Date().toJSON();
    const newCourse: Course = courseForm.value;
    newCourse.createOn = now;
    newCourse.lastUpdateOn = now;
    newCourse.createBy = this.afAuth.auth.currentUser && this.afAuth.auth.currentUser.uid;

    this.coursesCollection.add(newCourse)
      .then(course => {
        this.initCourseAddModel();
      })
      .catch(error => {
        console.error(`${error.name}: ${error.code}`);
      });
  }

  removeCourse(course: Course) {
    this.coursesCollection.doc(course.id).delete()
      .catch(error => {
        console.error(`${error.name}: ${error.code}`);
      });
  }

  private initCourseAddModel() {
    const now = new Date().toJSON();
    this.courseAddModel = {
      courseNo: '',
      name: '123',
      description: '',
      startOn: now,
      endOn: now,
      address: '',
      teacher: [],
      applyLink: '',
      status: 0
    };
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
