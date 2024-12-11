import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterModule } from '@angular/router';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommentService } from '../../../../core/services/comment.service';
import { IComments } from '../../../../core/interfaces/models/comment.model.interface';

@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatButtonModule, RouterModule,
    MatInputModule, MatCheckboxModule,
    MatFormFieldModule, MatIconModule, MatTableModule,
    MatCardModule],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.scss'
})
export class CommentsListComponent {
  moment = moment;
  commentService = inject(CommentService)
  displayedColumns: string[] = ['select', 'id', 'content', 'createdAt', 'updatedAt'];
  dataSource = new MatTableDataSource<IComments>([]);
  selection = new SelectionModel<IComments>(true, []);
  postId?: number;
  route = inject(ActivatedRoute)

  constructor(){
    this.route.params.subscribe((params)=>{
      this.postId=params['postId']
      this.loadAllComments()

    })
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: IComments): string {
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

  deleteSelectedComments() {
    const selectedComment = this.selection.selected;
    const selectedCommentId = selectedComment.map((comment) => comment.id)
    let promises =
      selectedCommentId.map((id) => {
        let obj = this.commentService.deleteComment(id);
        return lastValueFrom(obj)
      });
    Promise.all(promises).then(() => {
      this.loadAllComments();
    })
  }

  ngOnInit(): void {
  }
  loadAllComments() {
    this.commentService.getComments(this.postId!).subscribe({
      next: (data: any) => {
        console.log('data', data)
        this.dataSource.data = data
      }, error: (err) => {
      }
    })
  }
}

