import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PostService } from '../../../../core/services/post.service';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatButtonModule, RouterModule,
    MatInputModule, MatCheckboxModule,
    MatFormFieldModule, MatIconModule,MatTableModule,
    MatCardModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent {
  moment = moment;
  postsService = inject(PostService)
  displayedColumns: string[] = ['select', 'id', 'title','totalComments','categoryId', 'createdAt', 'updatedAt', 'actions'];
  dataSource = new MatTableDataSource<IPost>([]);
  selection = new SelectionModel<IPost>(true, []);


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: IPost): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  deleteSelectedPosts() {
    const selectedPost = this.selection.selected;
    const selectedPostId = selectedPost.map((post) => post.id)
    let promises =
    selectedPostId.map((id) => {
        let obj = this.postsService.deletePost(id);
        return lastValueFrom(obj)
      });
    Promise.all(promises).then(() => {
      this.loadAllPosts();
    })
  }

  ngOnInit(): void {
    this.loadAllPosts()
  }
  loadAllPosts() {
    this.postsService.getPosts({}).subscribe({
      next: (data: any) => {
        console.log('data', data)
        this.dataSource.data = data
      }, error: (err) => {
      }
    })
  }
}
