import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TagService } from '../../../../core/services/tag.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITag } from '../../../../core/interfaces/models/tag.model.interface';

@Component({
  selector: 'app-tags-editor',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule],
  templateUrl: './tags-editor.component.html',
  styleUrl: './tags-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class TagsEditorComponent {
  fb = inject(FormBuilder);
  tagService = inject(TagService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  tag: ITag | undefined;

  form = this.fb.group({
    name: ['', Validators.required],
    id: ['']
  })

  constructor() {
    this.route.params.subscribe((data) => {
      const slug = data['slug'];
      if (slug) {
        this.tagService.getTagBySlug(slug).subscribe((tag) => {
          this.tag = tag;
          this.form.patchValue({
            id: tag.id+'',
            name: tag.name
          })
          this.form.updateValueAndValidity();
        })
      }
    });
  }

  submit() {

    if (this.form.invalid) {
      return;
    } else {
      if(this.form.value.id){
        this.tagService.updateTag({ name: this.form.value.name!,id: parseInt(this.form.value.id!), }).subscribe(() => {
          this.router.navigate(['/admin/tags'])
        })
      }else{
        this.tagService.addTag({ name: this.form.value.name! }).subscribe(() => {
          this.router.navigate(['/admin/tags'])
        })
      }
     
    }
  }
}
