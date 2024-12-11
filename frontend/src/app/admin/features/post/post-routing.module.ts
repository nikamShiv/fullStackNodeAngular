import { PostEditorComponent } from './post-editor/post-editor.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';

const routes: Routes = [
  {
    path:'',component:PostListComponent
  },
  {
    path:'post/:id',component:PostEditorComponent
  },
  {
    path:'add',component:PostEditorComponent
 },
 {
  path:'edit/:slug',component:PostEditorComponent
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule { }
