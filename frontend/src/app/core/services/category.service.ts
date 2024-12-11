import { getCategories } from './../../../../../backend/src/controllers/category.controller';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ICategory } from '../interfaces/models/category.model.interface';
import { share } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseUrl = environment.BACKEND_API_URL + '/api/categories';
  httpClient=inject(HttpClient);
  authService=inject(AuthService)
  constructor() { }

  getCategoriesBySlug(slug:string){
    return this.httpClient.get<ICategory>(`${this.baseUrl}/slug/${slug}`);
  }

  getAllCategories(){
    return this.httpClient.get<ICategory>(`${this.baseUrl}`);
  }
  deleteCategory(id:any){
    const ob= this.httpClient.delete<ICategory>(`${this.baseUrl}`,{body:{"id":id}});
    return ob;
  }

  addCategory({name}:{name:string}){
    return this.httpClient.post<ICategory>(`${this.baseUrl}`, {name})
  }

 updateCategory({name,id}:{name:string,id:number}){
    return this.httpClient.put<ICategory>(`${this.baseUrl}`, {name,id})
  }
}
