import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ITag } from '../interfaces/models/tag.model.interface';
import { IPostTag } from '../interfaces/post-tag.model.interface';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  baseUrl = environment.BACKEND_API_URL + '/api/tags';
  httpClient=inject(HttpClient);
  constructor() { }

  getPostTags(id:number){
    return this.httpClient.get<IPostTag>(`${this.baseUrl}/getPostTagRelations/${id}`);
  }

  getTagBySlug(slug:string){
    return this.httpClient.get<ITag>(`${this.baseUrl}/getTagBySlug/${slug}`);
  }

  getTags(){
    return this.httpClient.get<ITag>(`${this.baseUrl}`);
  }
  deleteTag(id:any){
    return this.httpClient.delete<ITag>(`${this.baseUrl}`,{body:{"id":id}});
  }

  addTag({name}:{name:string}){
    return this.httpClient.post<ITag>(`${this.baseUrl}`, {name})
  }

  updateTag({name,id}:{name:string,id:number}){
    return this.httpClient.put<ITag>(`${this.baseUrl}`, {name,id})
  }
}
