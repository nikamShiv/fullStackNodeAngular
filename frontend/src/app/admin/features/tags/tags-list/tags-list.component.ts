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
import { ITag } from '../../../../core/interfaces/models/tag.model.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TagService } from '../../../../core/services/tag.service';
@Component({
  selector: 'app-tags-list',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatButtonModule, RouterModule,
    MatInputModule, MatCheckboxModule,
    MatFormFieldModule, MatIconModule,MatTableModule,
    MatCardModule],
  templateUrl: './tags-list.component.html',
  styleUrl: './tags-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsListComponent implements OnInit {
  moment = moment;
  tagService = inject(TagService)
  displayedColumns: string[] = ['select', 'id', 'name', 'createdAt', 'updatedAt', 'actions'];
  dataSource = new MatTableDataSource<ITag>([]);
  selection = new SelectionModel<ITag>(true, []);


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: ITag): string {
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

  deleteSelectedTags() {
    const selectedTag = this.selection.selected;
    const selectedTagId = selectedTag.map((tag) => tag.id)
    let promises =
      selectedTagId.map((id) => {
        let obj = this.tagService.deleteTag(id);
        return lastValueFrom(obj)
      });
    Promise.all(promises).then(() => {
      this.loadAllTags();
    })
  }

  ngOnInit(): void {
    this.loadAllTags()
  }
  loadAllTags() {
    this.tagService.getTags().subscribe({
      next: (data: any) => {
        console.log('data', data)
        this.dataSource.data = data
      }, error: (err) => {
      }
    })
  }
}
