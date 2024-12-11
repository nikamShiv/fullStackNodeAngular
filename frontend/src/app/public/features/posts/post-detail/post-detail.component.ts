import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostService } from '../../../../core/services/post.service';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import moment from 'moment';
import { IPostTag } from '../../../../core/interfaces/post-tag.model.interface';
import { TagService } from '../../../../core/services/tag.service';
import { IComments } from '../../../../core/interfaces/models/comment.model.interface';
import { CommentService } from '../../../../core/services/comment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent {
  route = inject(ActivatedRoute);
  moment = moment;
  postService = inject(PostService);
  tagService = inject(TagService);
  commentService = inject(CommentService);
  authService = inject(AuthService)
  fb = inject(FormBuilder)
  form = this.fb.group({
    content: ['', Validators.required]
  })
  post?: IPost;
  postTags?: IPostTag[] = [];
  comments: IComments[] = []
  constructor() {
    this.route.params.subscribe((params) => {
      this.loadPosts(params['slug'])
    });
  }

  loadPosts(slug: any) {
    this.postService.getPostBySlug(slug).subscribe((data: any) => {
      this.post = data;
      this.loadComments();
      this.loadPostTags();
    });
  }

  loadPostTags() {
    if (this.post) {
      this.tagService.getPostTags(this.post.id).subscribe((data: any) => {
        this.postTags = data;
      });
    }
  }

  loadComments() {
    if (this.post)
      this.commentService.getComments(this.post.id).subscribe((data) => {
        this.comments = data;
      })
  }

  submitComment() {
    if (this.post)
      this.commentService.createComment( this.form.value.content!, this.post.id ).subscribe({
        next: () => {
          this.loadComments();
          this.form.reset();
        }, error: (err) => {
          if(err && err.error && err.error.message){
            alert(err.error.message)
          }
        }
      })
  }
}
