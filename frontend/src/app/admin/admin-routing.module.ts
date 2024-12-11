import { PostsModule } from './../public/features/posts/posts.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {path:'',component:AdminComponent,
    children:[
      {path:'',loadChildren:()=>import('./features/post/post.module').then(m=>m.PostModule)},

      {path:'categories',loadChildren:()=>import('./features/categories/categories.module').then(m=>m.CategoriesModule)},
      {path:'tags',loadChildren:()=>import('./features/tags/tags.module').then(m=>m.TagsModule)},
      {path:'posts',loadChildren:()=>import('./features/post/post.module').then(m=>m.PostModule)},
      {path:'comments',loadChildren:()=>import('./features/comments/comments.module').then(m=>m.CommentsModule)}
 
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
