import { Component, inject } from '@angular/core';
import { PostsListComponent } from '../../posts/posts-list/posts-list.component';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../../core/services/category.service';
import { ICategory } from '../../../../core/interfaces/models/category.model.interface';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [PostsListComponent],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss'
})
export class CategoryDetailComponent {
  route = inject(ActivatedRoute);
  category? :ICategory;
categoryService=inject(CategoryService)
   constructor() {
     this.route.params.subscribe(params => {
      let slug= params['category'];
     
this.loadCategory(slug)

     
     });
   }

   loadCategory(slug:string){
    this.categoryService.getCategoriesBySlug(slug).subscribe((data: any) => {
      this.category=data;
     })
   }
}
