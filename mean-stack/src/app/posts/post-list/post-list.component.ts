import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

    isLoading = false;
    posts: Post[] = [];
    postsSub: Subscription;
    
    totalPosts = 0;
    postsPerPage = 2;
    pageSizeOptions = [1,2,5,10];
    currentPage = 1;
    userIsAuthenticated = false;
    userId: string;
    private authStatusSub: Subscription;
    constructor(
        
        private postsService: PostsService,
        private authService: AuthService
    ) {}

    ngOnInit() {

        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.postsSub = this.postsService.getPostsUpdatedListener()
        .subscribe((postData: {posts: Post[], postCount: number}) => {
            
            this.isLoading = false;
            this.totalPosts = postData.postCount;
            this.posts = postData.posts;.0
        });
        
        this.userId = this.authService.getUserId();
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener()
        .subscribe(isAuthenticated => {

            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
        })
    }

    onChangePage(pageData: PageEvent){


        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }

    onDelete(postId: string) {

        this.isLoading = true;
        this.postsService.deletePost(postId).subscribe(() => {
            
            this.postsService.getPosts(this.postsPerPage, this.currentPage);
            
        }, () => {

            this.isLoading = false;
        })
    }

    ngOnDestroy() {

        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }
}