import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { mimeType } from "./mime-type.validator";

@Component({

    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
    
    isLoading = false;
    enteredTitle = '';
    enteredContent = '';
    mode = 'create';
    imagePreview: string;
    postId: string;
    private authStatusSub: Subscription;
    post: Post;
    form: FormGroup;
    constructor(
        
        private postsService: PostsService,
        public route: ActivatedRoute,
        private authService: AuthService
    ) {}

    ngOnInit() {

        this.form = new FormGroup({

            title: new FormControl(
                null, 
                {validators: [Validators.required, Validators.minLength(3)]}
            ),
            image: new FormControl(null, {
                validators: [Validators.required], 
                asyncValidators: [mimeType]}),
            content: new FormControl(null, {validators: [Validators.required]})
        })
        
        this.route.paramMap.subscribe((paramMap: ParamMap) => {

            if(paramMap.has('postId')){

                this.mode = 'edit';
                this.postId = paramMap.get('postId');

                this.isLoading = true;
                this.postsService.getPost(this.postId).subscribe(post => {
                
                    this.post = {
                        id: post._id, 
                        title: post.title, 
                        content: post.content,
                        imagePath: post.imagePath,
                        creator: post.creator
                    };
                    this.form.setValue({
                        title: this.post.title, 
                        content: this.post.content,
                        image: this.post.imagePath
                    });

                    this.isLoading = false;
                })
                
            } else {

                this.mode = 'create';
                this.postId = null;
            }
        })
        
    }

    onImagePicked(event: Event) {

        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file});
        this.form.get('image').updateValueAndValidity();

        const reader = new FileReader();
        reader.onload = () => {

            this.imagePreview = reader.result as string;
        }

        reader.readAsDataURL(file);
    }

    onSave() {

        if(this.form.invalid) {

            return;
        }
        
        this.isLoading = true;
        if(this.mode === 'create'){

            this.postsService.addPost(
                this.form.value.title, 
                this.form.value.content, 
                this.form.value.image
            );
        } else {

            this.postsService.updatePost(
                this.postId, 
                this.form.value.title, 
                this.form.value.content,
                this.form.value.image
            )
        }
        this.isLoading = false;
        this.form.reset();
    }
}