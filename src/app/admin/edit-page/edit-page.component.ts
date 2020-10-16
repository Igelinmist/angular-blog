import { AlertService } from './../shared/services/alert.service';
import { PostsService } from './../../shared/posts.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Post } from 'src/app/shared/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss'],
})
export class EditPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  post: Post;
  submitted = false;

  uSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private postService: PostsService,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.postService.getById(params['id']);
        })
      )
      .subscribe((post: Post) => {
        this.post = post;
        this.form = new FormGroup({
          title: new FormControl(post.title, Validators.required),
          text: new FormControl(post.text, Validators.required),
        });
      });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;
    this.uSub = this.postService
      .update({
        ...this.post,
        title: this.form.value.title,
        text: this.form.value.text,
      })
      .subscribe(() => {
        this.submitted = false;
        this.alert.success('Пост был успешно обновлён.');
      });
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }
}
