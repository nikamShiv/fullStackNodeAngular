import { TagService } from './../../../../core/services/tag.service';
import { Component, inject } from '@angular/core';
import { PostsListComponent } from '../../posts/posts-list/posts-list.component';
import { ActivatedRoute } from '@angular/router';
import { ITag } from '../../../../core/interfaces/models/tag.model.interface';
@Component({
  selector: 'app-tag-detail',
  standalone: true,
  imports: [PostsListComponent],
  templateUrl: './tag-detail.component.html',
  styleUrl: './tag-detail.component.scss'
})
export class TagDetailComponent {
  route = inject(ActivatedRoute);
  tag? :ITag;
tagService=inject(TagService)
   constructor() {
     this.route.params.subscribe(params => {
      let slug = params['tag'];
      this.loadTag(slug)
     });
   }

   loadTag(slug:string){
    this.tagService.getTagBySlug(slug).subscribe((data)=>{
      this.tag =data;
    })
   }
}
