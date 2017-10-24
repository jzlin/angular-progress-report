import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { Course } from '../../interfaces/course';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.css']
})
export class CourseEditComponent implements OnInit {

  courseEditModel: Course;

  private coursesDoc: AngularFirestoreDocument<Course>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    const courseKey = this.route.snapshot.paramMap.get('courseKey');
    this.coursesDoc = this.afs.doc<Course>(`courses/${courseKey}`);
    this.initCourseEditModel();
  }

  editCourse(courseForm) {
    const now = new Date().toJSON();
    const newCourse: Course = courseForm.value;
    newCourse.lastUpdateOn = now;

    this.coursesDoc.update(newCourse)
      .then(course => {
        this.router.navigate(['admin', 'courses']);
      })
      .catch(error => {
        console.error(`${error.name}: ${error.code}`);
      });
  }

  private initCourseEditModel() {
    this.coursesDoc.snapshotChanges()
      .take(1)
      .map(action => {
        const data = action.payload.data();
        const id = action.payload.id;
        return { id, ...data } as Course;
      })
      .subscribe(data => {
        console.log(data);
        this.courseEditModel = data;
      });
  }

}
