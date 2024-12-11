import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { ICategory } from '../../../../core/interfaces/models/category.model.interface';
import moment from 'moment';
import { CategoryService } from '../../../../core/services/category.service';
import { MatButtonModule } from '@angular/material/button';
import { lastValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

const ELEMENT_DATA: ICategory[] = [
];

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule, MatButtonModule,RouterModule,
    MatIconModule
  ],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent implements OnInit {
  displayedColumns: string[] = ['select', 'id', 'name', 'createdAt', 'updatedAt','actions'];
  dataSource = new MatTableDataSource<ICategory>([]);
  selection = new SelectionModel<ICategory>(true, []);
  moment = moment;
  categoryService = inject(CategoryService)
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  ngOnInit(): void {
    this.loadCategories()
  }
  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data: any) => {
        console.log('data', data)
        this.dataSource.data = data
      }, error: (err) => {
      }
    })
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ICategory): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  deleteSelectedCategory() {
    const selectedCategory = this.selection.selected;
    const selectedCategoryId = selectedCategory.map((category) => category.id)
    let promises =
      selectedCategoryId.map((id) => {
        let obj = this.categoryService.deleteCategory(id);
        return lastValueFrom(obj)
      });
    Promise.all(promises).then(() => {
      this.loadCategories();
    })
  }
}
