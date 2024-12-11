import { inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from '@angular/material/input'
import { CategoryService } from '../../../../core/services/category.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICategory } from '../../../../core/interfaces/models/category.model.interface';

@Component({
  selector: 'app-category-editor',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule
  ],
  templateUrl: './category-editor.component.html',
  styleUrl: './category-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryEditorComponent {
  fb = inject(FormBuilder);
  categoryService = inject(CategoryService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  category: ICategory | undefined;

  form = this.fb.group({
    name: ['', Validators.required],
    id: ['']
  })

  constructor() {
    this.route.params.subscribe((data) => {
      const slug = data['slug'];
      if (slug) {
        this.categoryService.getCategoriesBySlug(slug).subscribe((category) => {
          this.category = category;
          this.form.patchValue({
            id: category.id+'',
            name: category.name
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
        this.categoryService.updateCategory({ name: this.form.value.name!,id: parseInt(this.form.value.id!), }).subscribe(() => {
          this.router.navigate(['/admin/categories'])
        })
      }else{
        this.categoryService.addCategory({ name: this.form.value.name! }).subscribe(() => {
          this.router.navigate(['/admin/categories'])
        })
      }
     
    }
  }
}
