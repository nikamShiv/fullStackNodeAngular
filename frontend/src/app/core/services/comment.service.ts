import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IComments } from '../interfaces/models/comment.model.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  baseUrl = environment.BACKEND_API_URL + '/api/comments';
  httpClient=inject(HttpClient);
  authService=inject(AuthService)
  constructor() { }


  getComments(postId: number) {
    return this.httpClient.get<IComments[]>(`${this.baseUrl}/${postId}`);
  }

  createComment(content:string,postId:number){
    return this.httpClient.post<IComments[]>(`${this.baseUrl}`,{content,postId})
  }

  deleteComment(commentId:number){
    return this.httpClient.delete<IComments[]>(`${this.baseUrl}`,{body:{
      commentId
    }})
  }
}
