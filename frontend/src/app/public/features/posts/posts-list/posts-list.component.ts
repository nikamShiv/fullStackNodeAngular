import { PostService } from './../../../../core/services/post.service';
import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, inject, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule,RouterModule ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss'
})
export class PostsListComponent implements AfterContentInit {

@Input() categoryId?:number;
@Input() tagId?:number;

posts:IPost[]=[]
postService=inject(PostService)
constructor(){
  
}
ngAfterContentInit(): void {
  this.postService.getPosts({categoryId:this.categoryId,tagId:this.tagId}).subscribe((data)=>{
    this.posts=data;
  })
}
}
