import { getAllTags } from './../../../../../../../backend/src/services/tags.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { PostService } from '../../../../core/services/post.service';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import { ICategory } from '../../../../core/interfaces/models/category.model.interface';
import { CategoryService } from '../../../../core/services/category.service';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ITag } from '../../../../core/interfaces/models/tag.model.interface';
import { TagService } from '../../../../core/services/tag.service';
@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatButtonModule,
    MatInputModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, MatChipsModule,
    MatCardModule],
  templateUrl: './post-editor.component.html',
  styleUrl: './post-editor.component.scss',

})
export class PostEditorComponent {
  fb = inject(FormBuilder);
  postsService = inject(PostService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  categoryService = inject(CategoryService)
  tagService = inject(TagService)
  post: IPost | undefined;
  categories: ICategory[] = []
  tagsData: ITag[] = []
  showTagsDropdown = false;

  form = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    categoryId: [null, Validators.required],
    tagIds: this.fb.array([]),
    id: ['']
  })


  constructor() {
    this.loadCategories();
    this.loadTags()
    this.route.params.subscribe((data) => {
      const slug = data['slug'];
      if (slug) {
        this.postsService.getPostBySlug(slug).subscribe((post) => {
          this.post = post;
          this.form.patchValue({
            id: post.id + '',
            title: post.title,
            content: post.content,
            categoryId: post.categoryId as any,
          })
          this.tagService.getPostTags(post.id).subscribe((tags: any) => {
            const tagIds = tags.map((tag: any) => tag.tagId);
            const tagIdsFormArray = this.form.get('tagIds') as FormArray;
            tagIds.forEach((tagId: any) => {
              tagIdsFormArray.push(this.fb.control(tagId))
            });

            this.showTagsDropdown = false
          });
          this.form.updateValueAndValidity();

        })
      }
    });
  }
  get selectedTags() {
    return this.tagsData.filter((tag) => {
      console.log('this.form.value.tagIds?.includes(tag.id)', this.form.value.tagIds)

      return this.form.value.tagIds?.includes(tag.id)
    })
  }
  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data: any) => {
        console.log('data', data)
        this.categories = data
      }, error: (err) => {
      }
    })
  }
  loadTags() {
    this.tagService.getTags().subscribe({
      next: (data: any) => {
        console.log('data', data)
        this.tagsData = data
      }, error: (err) => {
      }
    })
  }

  submit() {

    if (this.form.invalid) {
      return;
    } else {
      if (this.form.value.id) {
        this.postsService.updatePost({
          title: this.form.value.title!,
          content: this.form.value.content!,
          categoryId: this.form.value.categoryId!,
          id: parseInt(this.form.value.id!), tagIds: this.form.value.tagIds as any[],
        }).subscribe(() => {
          this.router.navigate(['/admin/posts'])
        })
      } else {
        this.postsService.addPost({
          title: this.form.value.title!,
          content: this.form.value.content!, categoryId: this.form.value.categoryId!,
          tagIds: this.form.value.tagIds as any[],
        }).subscribe(() => {
          this.router.navigate(['/admin/posts'])
        })
      }

    }


  }
  addTag(tagId: number) {
    const tagIdsFormArray = this.form.get('tagIds') as FormArray;

    tagIdsFormArray.push(this.fb.control(tagId))
    this.showTagsDropdown = false
  }
  removeTag(tagId: number) {
    const tagIdsFormArray = this.form.get('tagIds') as FormArray;
    const index = tagIdsFormArray.controls.findIndex((control) => {
      return control.value === tagId
    })
    tagIdsFormArray.removeAt(index)
  }
}

