import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { Course } from '../../interfaces/course';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.css']
})
export class CourseAddComponent implements OnInit {

  courseAddModel: Course;

  private coursesCollection: AngularFirestoreCollection<Course>;

  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.coursesCollection = this.afs.collection<Course>('courses', ref => ref.orderBy('startOn'));
    this.initCourseAddModel();
  }

  addCourse(courseForm) {
    const now = new Date().toJSON();
    const newCourse: Course = courseForm.value;
    newCourse.createOn = now;
    newCourse.lastUpdateOn = now;
    newCourse.createBy = this.afAuth.auth.currentUser && this.afAuth.auth.currentUser.uid;

    this.coursesCollection.add(newCourse)
      .then(course => {
        this.router.navigate(['admin', 'courses']);
      })
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

}
